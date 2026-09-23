import React, { useState, useEffect, useRef } from 'react';
import { HotelDetail, Hotel, Location } from '../../types';
import { ownerApi, locationApi } from '../../api/client';
import { ImageUploader } from '../common/ImageUploader';
import { X, Save, Image, Plus, Trash2, CheckCircle2, Star, MapPin } from 'lucide-react';

interface EditHotelModalProps {
  hotel: Hotel | HotelDetail;
  isOpen: boolean;
  onClose: () => void;
  onHotelUpdated: () => void;
}

const ALL_AMENITIES = [
  'Free Wi-Fi',
  'Infinity Swimming Pool',
  'Swimming Pool',
  'Ayurvedic Spa',
  'Fine Dining Restaurant',
  'Cocktail Lounge',
  'Fitness Center',
  'Valet Parking',
  'Airport Shuttle',
  'Beachfront Access',
  'Rooftop Lounge',
  '24/7 Room Service',
  'Heritage Courtyard',
  'Concierge'
];

export const EditHotelModal: React.FC<EditHotelModalProps> = ({
  hotel,
  isOpen,
  onClose,
  onHotelUpdated
}) => {
  const [name, setName] = useState(hotel.name);
  const [description, setDescription] = useState(hotel.description || '');
  const [starRating, setStarRating] = useState(hotel.starRating || 5);
  const [startingPrice, setStartingPrice] = useState(hotel.startingPrice || 8000);
  const [address, setAddress] = useState(hotel.address);
  const [city, setCity] = useState(hotel.city);
  const [state, setState] = useState(hotel.state || '');
  const [country, setCountry] = useState(hotel.country);
  const [landmark, setLandmark] = useState(hotel.landmark || '');
  const [primaryImageUrl, setPrimaryImageUrl] = useState(hotel.primaryImageUrl);
  const [images, setImages] = useState<string[]>(hotel.images || [hotel.primaryImageUrl]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(hotel.amenities || []);
  const [submitting, setSubmitting] = useState(false);

  // Location search (optional override)
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (locationSearchTimeout.current) clearTimeout(locationSearchTimeout.current);
    if (!locationQuery.trim()) {
      setLocationResults([]);
      setShowLocationDropdown(false);
      return;
    }
    locationSearchTimeout.current = setTimeout(async () => {
      try {
        const results = await locationApi.search(locationQuery);
        setLocationResults(results);
        setShowLocationDropdown(results.length > 0);
      } catch {
        setLocationResults([]);
      }
    }, 300);
    return () => { if (locationSearchTimeout.current) clearTimeout(locationSearchTimeout.current); };
  }, [locationQuery]);

  const handleSelectLocation = (loc: Location) => {
    setSelectedLocation(loc);
    setLocationId(loc.id);
    setLocationQuery(`${loc.city}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`);
    setShowLocationDropdown(false);
    setCity(loc.city);
    if (loc.state) setState(loc.state);
    setCountry(loc.country);
    if (loc.landmark) setLandmark(loc.landmark);
  };

  useEffect(() => {
    setName(hotel.name);
    setDescription(hotel.description || '');
    setStarRating(hotel.starRating || 5);
    setStartingPrice(hotel.startingPrice || 8000);
    setAddress(hotel.address);
    setCity(hotel.city || '');
    setState(hotel.state || '');
    setCountry(hotel.country || '');
    setLandmark(hotel.landmark || '');
    setPrimaryImageUrl(hotel.primaryImageUrl);
    setImages(hotel.images?.length ? hotel.images : [hotel.primaryImageUrl]);
    setSelectedAmenities(hotel.amenities || []);
    // Reset location search override
    setLocationQuery('');
    setSelectedLocation(null);
    setLocationId(null);
    setShowLocationDropdown(false);
  }, [hotel]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const url = newImageUrl.trim();
      if (!images.includes(url)) {
        setImages([...images, url]);
      }
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    const updated = images.filter(u => u !== imgUrl);
    setImages(updated);
    if (primaryImageUrl === imgUrl && updated.length > 0) {
      setPrimaryImageUrl(updated[0]);
    }
  };

  const handleSetPrimary = (imgUrl: string) => {
    setPrimaryImageUrl(imgUrl);
    // Put primary image first
    const rest = images.filter(u => u !== imgUrl);
    setImages([imgUrl, ...rest]);
  };

  const toggleAmenity = (am: string) => {
    if (selectedAmenities.includes(am)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== am));
    } else {
      setSelectedAmenities([...selectedAmenities, am]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Ensure primary image is included in image list
      const finalImages = images.includes(primaryImageUrl)
        ? images
        : [primaryImageUrl, ...images];

      const payload: any = {
        name,
        description,
        starRating,
        startingPrice: Number(startingPrice) || 8000,
        address,
        city,
        state,
        country,
        landmark,
        primaryImageUrl,
        images: finalImages,
        amenities: selectedAmenities,
        // Only include locationId if the user picked a new location
        ...(locationId ? { locationId } : {})
      };

      await ownerApi.updateHotel(hotel.id, payload);
      // Also sync images array
      await ownerApi.updateHotelImages(hotel.id, finalImages).catch(() => {});

      onHotelUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update hotel information');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Manage Hotel Details & Photo Gallery</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Editing: {hotel.name}</p>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dynamic Images Management Section */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <Image size={18} color="#4f46e5" />
                <span>Hotel Gallery Photos ({images.length})</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click "Set Cover" on any photo to make it primary</span>
            </div>

            {/* Upload to Neon Storage */}
            <div style={{ marginBottom: '1rem' }}>
              <ImageUploader
                label="Upload New Photo directly to Neon Storage"
                folder="hotels"
                value=""
                onChange={(url) => {
                  if (url && !images.includes(url)) {
                    setImages([url, ...images]);
                  }
                }}
                compact
              />
            </div>

            {/* Add Photo URL Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="url"
                placeholder="Or paste external photo URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddImage} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Plus size={15} /> Add URL
              </button>
            </div>

            {/* Grid of Existing Photos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {images.map((url, idx) => {
                const isPrimary = url === primaryImageUrl;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '95px',
                      border: isPrimary ? '3px solid #4f46e5' : '1px solid var(--border)',
                      backgroundColor: '#e2e8f0'
                    }}
                  >
                    <img src={url} alt={`Photo ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    {isPrimary && (
                      <div style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        Cover Photo
                      </div>
                    )}

                    <div style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(url)}
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.4rem',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          Set Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url)}
                        title="Remove photo"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.2rem 0.35rem',
                          fontSize: '0.65rem',
                          cursor: 'pointer',
                          marginLeft: 'auto'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotel Name & Star Rating & Starting Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Property Name *
              </label>
              <input
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Star Rating
              </label>
              <select value={starRating} onChange={(e) => setStarRating(parseInt(e.target.value))} style={{ width: '100%' }}>
                <option value={5}>5-Star Luxury</option>
                <option value={4}>4-Star Premium</option>
                <option value={3}>3-Star Comfort</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Starting Rate (₹ / night)
              </label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              About Property Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Location Search (optional override) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="#4f46e5" /> Change Location (optional)
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={`Current: ${hotel.city || ''}${hotel.state ? ', ' + hotel.state : ''}${hotel.country ? ', ' + hotel.country : ''} — search to change`}
                value={locationQuery}
                onChange={(e) => { setLocationQuery(e.target.value); setSelectedLocation(null); setLocationId(null); }}
                style={{ width: '100%', borderColor: selectedLocation ? '#10b981' : undefined }}
                autoComplete="off"
              />
              {selectedLocation && (
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, pointerEvents: 'none' }}>
                  ✓ Changed
                </span>
              )}
              {showLocationDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  zIndex: 100,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {locationResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      style={{
                        padding: '0.6rem 0.9rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <MapPin size={13} color="#94a3b8" />
                      <span><strong>{loc.city}</strong>{loc.state ? `, ${loc.state}` : ''}, {loc.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Leave blank to keep the current location. City/State/Country below will auto-fill on selection.
            </p>
          </div>

          {/* Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Amenities checklist */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Amenities
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem' }}>
              {ALL_AMENITIES.map((am) => (
                <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(am)}
                    onChange={() => toggleAmenity(am)}
                    style={{ accentColor: '#4f46e5' }}
                  />
                  <span>{am}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Save size={16} />
              <span>{submitting ? 'Updating...' : 'Save Hotel Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
