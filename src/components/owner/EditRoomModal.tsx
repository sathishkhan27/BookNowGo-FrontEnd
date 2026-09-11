import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import { ownerApi } from '../../api/client';
import { ImageUploader } from '../common/ImageUploader';
import { X, Save, Image, Plus, Trash2, Bed } from 'lucide-react';

interface EditRoomModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onRoomUpdated: () => void;
}

const COMMON_ROOM_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Smart TV',
  'Air Conditioning',
  'Mini Bar',
  'Private Balcony',
  'Ocean View',
  'Espresso Maker',
  'Bathtub',
  'In-room Safe',
  'Plunge Pool'
];

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  room,
  isOpen,
  onClose,
  onRoomUpdated
}) => {
  const [name, setName] = useState(room.name);
  const [roomType, setRoomType] = useState(room.roomType);
  const [description, setDescription] = useState(room.description || '');
  const [basePrice, setBasePrice] = useState(room.basePrice);
  const [discountedPrice, setDiscountedPrice] = useState(room.discountedPrice || Math.round(room.basePrice * 0.9));
  const [maxAdults, setMaxAdults] = useState(room.maxAdults);
  const [maxChildren, setMaxChildren] = useState(room.maxChildren);
  const [bedType, setBedType] = useState(room.bedType);
  const [roomSize, setRoomSize] = useState(room.roomSizeSqft || 400);
  const [mealPlan, setMealPlan] = useState(room.mealPlan);
  const [cancellationPolicy, setCancellationPolicy] = useState(room.cancellationPolicy);
  const [totalQuantity, setTotalQuantity] = useState(room.totalQuantity || 5);

  // Images
  const [primaryImageUrl, setPrimaryImageUrl] = useState(room.primaryImageUrl);
  const [images, setImages] = useState<string[]>(room.images || [room.primaryImageUrl]);
  const [newImageInput, setNewImageInput] = useState('');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(room.amenities || []);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(room.name);
    setRoomType(room.roomType);
    setDescription(room.description || '');
    setBasePrice(room.basePrice);
    setDiscountedPrice(room.discountedPrice || Math.round(room.basePrice * 0.9));
    setMaxAdults(room.maxAdults);
    setMaxChildren(room.maxChildren);
    setBedType(room.bedType);
    setRoomSize(room.roomSizeSqft || 400);
    setMealPlan(room.mealPlan);
    setCancellationPolicy(room.cancellationPolicy);
    setTotalQuantity(room.totalQuantity || 5);
    setPrimaryImageUrl(room.primaryImageUrl);
    setImages(room.images?.length ? room.images : [room.primaryImageUrl]);
    setSelectedAmenities(room.amenities || []);
  }, [room]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      const url = newImageInput.trim();
      if (!images.includes(url)) {
        setImages([...images, url]);
      }
      setNewImageInput('');
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
    if (!name.trim() || !primaryImageUrl.trim()) return;

    setSubmitting(true);
    try {
      const finalImages = images.includes(primaryImageUrl)
        ? images
        : [primaryImageUrl, ...images];

      const payload = {
        name: name.trim(),
        roomType,
        description: description.trim(),
        basePrice: Number(basePrice) || 8000,
        discountedPrice: Number(discountedPrice) || Math.round(Number(basePrice) * 0.9),
        discountPercentage: Math.max(0, Math.round(((Number(basePrice) - Number(discountedPrice)) / Number(basePrice)) * 100)) || 10,
        maxAdults,
        maxChildren,
        bedType,
        roomSizeSqft: roomSize,
        mealPlan,
        cancellationPolicy,
        totalQuantity,
        primaryImageUrl: primaryImageUrl.trim(),
        images: finalImages,
        imageUrls: finalImages,
        amenities: selectedAmenities,
        isActive: true
      };

      await ownerApi.updateRoom(room.id, payload);
      await ownerApi.updateRoomImages(room.id, finalImages).catch(() => {});

      onRoomUpdated();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to update room');
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
            <Bed size={20} color="#4f46e5" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Edit Room & Pricing</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Editing: {room.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dynamic Images Management Section */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
                <Image size={18} color="#4f46e5" />
                <span>Room Photos ({images.length})</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click "Cover" to set main room thumbnail</span>
            </div>

            {/* Upload directly to Neon Storage */}
            <div style={{ marginBottom: '0.75rem' }}>
              <ImageUploader
                label="Upload Room Photo to Neon Storage"
                folder="rooms"
                value=""
                onChange={(url) => {
                  if (url && !images.includes(url)) {
                    setImages([url, ...images]);
                  }
                }}
                compact
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="url"
                placeholder="Or paste external room image URL"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
                style={{ flex: 1, fontSize: '0.8rem' }}
              />
              <button type="button" onClick={handleAddImage} className="btn btn-outline btn-sm">
                <Plus size={14} /> Add URL
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem' }}>
              {images.map((url, idx) => {
                const isPrimary = url === primaryImageUrl;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      height: '80px',
                      border: isPrimary ? '3px solid #4f46e5' : '1px solid var(--border)'
                    }}
                  >
                    <img src={url} alt={`Room ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(url)}
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '0.15rem 0.3rem',
                            fontSize: '0.6rem',
                            cursor: 'pointer'
                          }}
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '0.15rem 0.3rem',
                          fontSize: '0.6rem',
                          cursor: 'pointer',
                          marginLeft: 'auto'
                        }}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Room Title *
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
                Category
              </label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={{ width: '100%' }}>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="STANDARD">Standard</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Pricing in INR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Base Price (₹ / night) *
              </label>
              <input
                type="number"
                min="500"
                step="100"
                value={basePrice}
                required
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Discounted Rate (₹)
              </label>
              <input
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Room Size (sq.ft)
              </label>
              <input
                type="number"
                value={roomSize}
                onChange={(e) => setRoomSize(parseInt(e.target.value) || 350)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Bed Setup
              </label>
              <select value={bedType} onChange={(e) => setBedType(e.target.value)} style={{ width: '100%' }}>
                <option value="King Bed">King Bed</option>
                <option value="Super King Bed">Super King Bed</option>
                <option value="Queen Bed">Queen Bed</option>
                <option value="Twin Beds">Twin Beds</option>
                <option value="Double Bed">Double Bed</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Max Adults
              </label>
              <input
                type="number"
                min="1"
                value={maxAdults}
                onChange={(e) => setMaxAdults(parseInt(e.target.value) || 2)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Max Children
              </label>
              <input
                type="number"
                min="0"
                value={maxChildren}
                onChange={(e) => setMaxChildren(parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Total Quantity
              </label>
              <input
                type="number"
                min="1"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Meal Plan
            </label>
            <input
              type="text"
              value={mealPlan}
              onChange={(e) => setMealPlan(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Room Amenities
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.4rem' }}>
              {COMMON_ROOM_AMENITIES.map((am) => (
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
              <span>{submitting ? 'Saving...' : 'Save Room Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
