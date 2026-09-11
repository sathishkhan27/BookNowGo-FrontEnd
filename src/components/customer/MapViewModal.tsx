import React, { useState } from 'react';
import { Hotel } from '../../types';
import { X, MapPin, Star, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapViewModalProps {
  hotels: Hotel[];
  isOpen: boolean;
  onClose: () => void;
}

export const MapViewModal: React.FC<MapViewModalProps> = ({ hotels, isOpen, onClose }) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotels[0] || null);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1100px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'white'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Explore Hotels on Map</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {hotels.length} verified properties with price pins
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Map Canvas + Selected Hotel Sidebar */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', position: 'relative', overflow: 'hidden' }}>
          {/* Simulated Interactive Map */}
          <div style={{
            position: 'relative',
            backgroundColor: '#e5e7eb',
            backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #e5e7eb 1.5px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Map Roads & Contours mock styling */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,200 Q300,100 800,350" stroke="#4f46e5" strokeWidth="8" fill="none" />
              <path d="M200,-50 Q400,300 350,800" stroke="#0ea5e9" strokeWidth="6" fill="none" />
              <path d="M-20,450 Q500,500 900,400" stroke="#94a3b8" strokeWidth="4" fill="none" />
            </svg>

            {/* Price Marker Pins */}
            {hotels.map((hotel, index) => {
              const isSelected = selectedHotel?.id === hotel.id;
              // deterministic spread across the canvas
              const top = 25 + ((index * 37) % 55);
              const left = 20 + ((index * 43) % 65);

              return (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  style={{
                    position: 'absolute',
                    top: `${top}%`,
                    left: `${left}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 30 : 10,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{
                    backgroundColor: isSelected ? '#1e1b4b' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: isSelected ? '0 0 15px rgba(79, 70, 229, 0.5)' : '0 3px 8px rgba(0,0,0,0.15)',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap'
                  }}>
                    <MapPin size={14} color={isSelected ? '#38bdf8' : '#4f46e5'} />
                    <span>${hotel.startingPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Hotel Preview Sidebar */}
          <div style={{
            borderLeft: '1px solid var(--border)',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto'
          }}>
            {selectedHotel ? (
              <>
                <div>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', height: '160px', marginBottom: '1rem' }}>
                    <img
                      src={selectedHotel.primaryImageUrl}
                      alt={selectedHotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                    {Array.from({ length: selectedHotel.starRating || 4 }).map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {selectedHotel.starRating}-Star
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    {selectedHotel.name}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {selectedHotel.address}, {selectedHotel.city}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="rating-badge" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                      {selectedHotel.averageRating.toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedHotel.reviewCount} reviews
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rate per night:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      ${selectedHotel.startingPrice}
                    </span>
                  </div>

                  <Link
                    to={`/hotel/${selectedHotel.slug}`}
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    View Room Options
                  </Link>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select any price pin on the map</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
