import React, { useState } from 'react';
import { ownerApi } from '../../api/client';
import { ImageUploader } from '../common/ImageUploader';
import { X, Plus, Trash2, Building2, Image, Sparkles } from 'lucide-react';

interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHotelCreated: () => void;
}

const DEFAULT_AMENITIES = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Ayurvedic Spa',
  'Fine Dining Restaurant',
  'Fitness Center',
  'Valet Parking',
  'Airport Shuttle',
  'Beachfront Access',
  'Rooftop Lounge',
  '24/7 Room Service'
];

export const CreateHotelModal: React.FC<CreateHotelModalProps> = ({
  isOpen,
  onClose,
  onHotelCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [starRating, setStarRating] = useState(5);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [startingPrice, setStartingPrice] = useState<number | ''>('');
  const [freeCancellation, setFreeCancellation] = useState(true);
  const [cancellationPolicy, setCancellationPolicy] = useState('Free cancellation up to 24 hours prior to check-in date.');

  // Images
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddGalleryUrl = () => {
    if (newGalleryInput.trim()) {
      setGalleryUrls([...galleryUrls, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !primaryImageUrl.trim()) {
      alert('Please provide a property name and primary photo URL');
      return;
    }

    setSubmitting(true);
    try {
      const allImages = [primaryImageUrl.trim(), ...galleryUrls.filter(u => u.trim())];
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const payload = {
        name: name.trim(),
        slug,
        description: description.trim(),
        starRating,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        area: area.trim() || undefined,
        landmark: landmark.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        checkInTime,
        checkOutTime,
        primaryImageUrl: primaryImageUrl.trim(),
        images: allImages,
        amenities: selectedAmenities,
        startingPrice: Number(startingPrice) || 0,
        originalPrice: Number(startingPrice) ? Math.round(Number(startingPrice) * 1.2) : 0,
        discountPercentage: Number(startingPrice) ? 15 : 0,
        freeCancellation,
        cancellationPolicy
      };

      await ownerApi.createHotel(payload);
      onHotelCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create hotel property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={22} color="#4f46e5" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Register New Hotel Property</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Configure dynamic property details, images, and amenities</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Property Name & Star Rating */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Property Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Whispering Palms Luxury Villa & Resort"
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
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe unique architectural charms, ocean views, proximity to attractions, and guest hospitality..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Location Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                City *
              </label>
              <input
                type="text"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Street Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 45 Beach Road, Calangute"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Area / Locality
              </label>
              <input
                type="text"
                placeholder="e.g. Calangute"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Near Calangute Pier"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Pricing & Timing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Starting Price (₹ INR / night) *
              </label>
              <input
                type="number"
                min="500"
                step="100"
                value={startingPrice}
                required
                onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Check-in Time
              </label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Check-out Time
              </label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Dynamic Images Control via Neon Storage */}
          <div style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
              <Image size={18} color="#4f46e5" />
              <span>Hotel Photos & Neon Database Storage</span>
            </div>

            {/* Primary Cover Photo Upload */}
            <ImageUploader
              label="Primary Cover Photo (Upload to Neon Storage) *"
              folder="hotels"
              value={primaryImageUrl}
              onChange={setPrimaryImageUrl}
            />

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <ImageUploader
                label={`Upload Additional Gallery Photos (${galleryUrls.length})`}
                folder="hotels"
                value=""
                onChange={(url) => {
                  if (url && !galleryUrls.includes(url)) {
                    setGalleryUrls([...galleryUrls, url]);
                  }
                }}
                compact
              />

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  placeholder="Or paste external photo URL"
                  value={newGalleryInput}
                  onChange={(e) => setNewGalleryInput(e.target.value)}
                  style={{ flex: 1, fontSize: '0.8rem' }}
                />
                <button type="button" onClick={handleAddGalleryUrl} className="btn btn-outline btn-sm">
                  <Plus size={14} /> Add URL
                </button>
              </div>

              {galleryUrls.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '90px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryUrl(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Select Amenities
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem' }}>
              {DEFAULT_AMENITIES.map((am) => {
                const checked = selectedAmenities.includes(am);
                return (
                  <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(am)}
                      style={{ accentColor: '#4f46e5' }}
                    />
                    <span>{am}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} />
              <span>{submitting ? 'Creating Property...' : 'Save & Register Property'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
