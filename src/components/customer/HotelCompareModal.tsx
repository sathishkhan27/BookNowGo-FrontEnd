import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { formatINR } from '../../utils/currency';
import { X, Check, Star, Trash2 } from 'lucide-react';

export const HotelCompareModal: React.FC = () => {
  const { compareHotels, removeFromCompare, clearCompare, isOpen, setIsOpen } = useCompare();

  if (!isOpen || compareHotels.length === 0) return null;

  const keyFeatures = [
    'Star Rating',
    'Guest Score',
    'Location',
    'Free Wi-Fi',
    'Swimming Pool',
    'Ayurvedic / Luxury Spa',
    'Fitness Center',
    'Free Cancellation',
    'Starting Price'
  ];

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '950px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Compare Selected Hotels
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Comparing {compareHotels.length} properties side-by-side
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={clearCompare}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444' }}
            >
              <Trash2 size={14} /> Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Comparison Grid Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid var(--border)', width: '25%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Property / Metric
                </th>
                {compareHotels.map((hotel) => (
                  <th key={hotel.id} style={{ padding: '0.75rem', borderBottom: '2px solid var(--border)', width: `${75 / compareHotels.length}%` }}>
                    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                      <img
                        src={hotel.primaryImageUrl}
                        alt={hotel.name}
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        onClick={() => removeFromCompare(hotel.id)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: 'rgba(0,0,0,0.65)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {hotel.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {hotel.city}, {hotel.country}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row: Star rating */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Star Rating</td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {Array.from({ length: h.starRating || 4 }).map((_, i) => (
                        <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <span style={{ marginLeft: '0.25rem', fontWeight: 600 }}>{h.starRating} Stars</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Guest Score */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Guest Rating</td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <span className="rating-badge" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                      {h.averageRating.toFixed(1)} / 10
                    </span>
                    <span style={{ marginLeft: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      ({h.reviewCount} reviews)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Starting Price */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Rate / Night</td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {formatINR(h.startingPrice)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Free Cancellation */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Free Cancellation</td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <Check size={16} /> Yes (24h before)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Amenities Highlights */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Amenities</td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {h.amenities?.slice(0, 4).join(', ')}
                  </td>
                ))}
              </tr>

              {/* Row: Actions */}
              <tr>
                <td style={{ padding: '1rem 0.75rem' }}></td>
                {compareHotels.map(h => (
                  <td key={h.id} style={{ padding: '1rem 0.75rem' }}>
                    <Link
                      to={`/hotel/${h.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', textDecoration: 'none' }}
                    >
                      View Deals
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
