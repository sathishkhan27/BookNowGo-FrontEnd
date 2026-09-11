import React from 'react';
import { HotelSearchFilters } from '../../types';
import { Filter, Star, Check, RotateCcw } from 'lucide-react';

interface HotelFiltersProps {
  filters: HotelSearchFilters;
  onChange: (newFilters: HotelSearchFilters) => void;
  onReset: () => void;
}

export const HotelFilters: React.FC<HotelFiltersProps> = ({ filters, onChange, onReset }) => {
  const amenitiesList = [
    'Free Wi-Fi',
    'Infinity Swimming Pool',
    'Swimming Pool',
    'Ayurvedic Spa',
    'Spa',
    'Beachfront Access',
    'Fine Dining Restaurant',
    'Fitness Center',
    'Valet Parking',
    'Airport Shuttle'
  ];

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated });
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
          <Filter size={18} color="#4f46e5" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.775rem',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Price per night (₹ INR)
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Min (₹)</span>
            <input
              type="number"
              value={filters.minPrice || ''}
              placeholder="₹0"
              step="500"
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            />
          </div>
          <span style={{ color: 'var(--text-light)', marginTop: '1rem' }}>-</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Max (₹)</span>
            <input
              type="number"
              value={filters.maxPrice || ''}
              placeholder="₹25,000+"
              step="500"
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Star Rating
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[5, 4, 3].map((stars) => {
            const isSelected = filters.starRating === stars;
            return (
              <button
                key={stars}
                onClick={() => onChange({ ...filters, starRating: isSelected ? undefined : stars })}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.2rem',
                  padding: '0.5rem 0.4rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #4f46e5' : '1px solid var(--border)',
                  backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: isSelected ? '#4f46e5' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <span>{stars}</span>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest Rating Score */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Guest Rating
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { label: 'Exceptional (9.0+)', val: 9.0 },
            { label: 'Superb (8.5+)', val: 8.5 },
            { label: 'Very Good (8.0+)', val: 8.0 }
          ].map((item) => {
            const isSelected = filters.minRating === item.val;
            return (
              <label
                key={item.val}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: isSelected ? '#4f46e5' : 'var(--text-main)',
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                <input
                  type="radio"
                  name="minRating"
                  checked={isSelected}
                  onChange={() => onChange({ ...filters, minRating: isSelected ? undefined : item.val })}
                  style={{ accentColor: '#4f46e5' }}
                />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Free Cancellation Toggle */}
      <div style={{ marginBottom: '1.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block' }}>Free Cancellation</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Only properties with flexible refund</span>
          </div>
          <input
            type="checkbox"
            checked={!!filters.freeCancellation}
            onChange={(e) => onChange({ ...filters, freeCancellation: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
          />
        </label>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Hotel Amenities
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {amenitiesList.map((am) => {
            const isChecked = filters.amenities?.includes(am);
            return (
              <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!isChecked}
                  onChange={() => handleAmenityToggle(am)}
                  style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                />
                <span>{am}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
