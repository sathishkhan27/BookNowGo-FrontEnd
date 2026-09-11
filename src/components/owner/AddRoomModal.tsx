import React, { useState } from 'react';
import { ownerApi } from '../../api/client';
import { ImageUploader } from '../common/ImageUploader';
import { X, Plus, Trash2, Image, Bed } from 'lucide-react';

interface AddRoomModalProps {
  hotelId: number;
  isOpen: boolean;
  onClose: () => void;
  onRoomAdded: () => void;
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

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  hotelId,
  isOpen,
  onClose,
  onRoomAdded
}) => {
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('DELUXE');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [maxAdults, setMaxAdults] = useState(2);
  const [maxChildren, setMaxChildren] = useState(1);
  const [bedType, setBedType] = useState('King Bed');
  const [roomSize, setRoomSize] = useState<number | ''>('');
  const [mealPlan, setMealPlan] = useState('Buffet Breakfast Included');
  const [cancellationPolicy, setCancellationPolicy] = useState('Free cancellation up to 24 hours before check-in');
  const [totalQuantity, setTotalQuantity] = useState(1);
  
  // Dynamic Images
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      setAdditionalImages([...additionalImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
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
      const allImages = [primaryImageUrl.trim(), ...additionalImages.filter(u => u.trim())];

      await ownerApi.createRoom(hotelId, {
        name: name.trim(),
        roomType,
        description: description.trim(),
        basePrice: Number(basePrice) || 0,
        discountedPrice: Number(basePrice) ? Math.round(Number(basePrice) * 0.9) : 0,
        discountPercentage: Number(basePrice) ? 10 : 0,
        maxAdults,
        maxChildren,
        bedType,
        roomSizeSqft: roomSize,
        mealPlan,
        cancellationPolicy,
        totalQuantity,
        primaryImageUrl: primaryImageUrl.trim(),
        imageUrls: allImages,
        images: allImages,
        amenities: selectedAmenities,
        isActive: true
      });

      onRoomAdded();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to add room type');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bed size={20} color="#4f46e5" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Add New Room Category</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Configure dynamic room photos, specs, amenities, and INR rates</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Room Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Deluxe Ocean View Suite"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Room Category
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
              Room Highlights & Description
            </label>
            <textarea
              rows={2}
              placeholder="Highlight sunset views, balcony, Italian marble bath, espresso bar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Pricing in INR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Base Rate (₹ / night) *
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
                Room Size (sq.ft)
              </label>
              <input
                type="number"
                value={roomSize}
                onChange={(e) => setRoomSize(parseInt(e.target.value) || 350)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Total Rooms Count
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

          {/* Capacity & Meal Plan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Max Adults
              </label>
              <input
                type="number"
                min="1"
                max="10"
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
                max="10"
                value={maxChildren}
                onChange={(e) => setMaxChildren(parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Meal Plan
              </label>
              <input
                type="text"
                placeholder="e.g. Buffet Breakfast Included"
                value={mealPlan}
                onChange={(e) => setMealPlan(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Dynamic Room Images via Neon Storage */}
          <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
              <Image size={18} color="#4f46e5" />
              <span>Room Photos & Neon Storage</span>
            </div>

            {/* Primary Room Photo */}
            <ImageUploader
              label="Primary Room Photo (Neon Storage) *"
              folder="rooms"
              value={primaryImageUrl}
              onChange={setPrimaryImageUrl}
            />

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <ImageUploader
                label={`Upload Additional Room Photos (${additionalImages.length})`}
                folder="rooms"
                value=""
                onChange={(url) => {
                  if (url && !additionalImages.includes(url)) {
                    setAdditionalImages([...additionalImages, url]);
                  }
                }}
                compact
              />

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  placeholder="Or paste external room photo URL"
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  style={{ flex: 1, fontSize: '0.8rem' }}
                />
                <button type="button" onClick={handleAddImage} className="btn btn-outline btn-sm">
                  <Plus size={14} /> Add URL
                </button>
              </div>

              {additionalImages.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {additionalImages.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '55px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={url} alt={`Room extra ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities checklist */}
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
              <Plus size={16} />
              <span>{submitting ? 'Creating...' : 'Create Room Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
