import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '../../types';
import { formatINR } from '../../utils/currency';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Heart, Star, MapPin, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare } = useCompare();

  const wishlisted = isWishlisted(hotel.id);
  const comparing = isComparing(hotel.id);

  const getRatingLabel = (score: number) => {
    if (score >= 9.0) return 'Exceptional';
    if (score >= 8.5) return 'Superb';
    if (score >= 8.0) return 'Very Good';
    if (score >= 7.0) return 'Good';
    return 'Pleasant';
  };

  return (
    <div className="bng-card" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(280px, 320px) 1fr minmax(200px, 240px)',
      gap: '1.25rem',
      padding: '1rem',
      position: 'relative',
      marginBottom: '1.25rem',
      backgroundColor: '#ffffff'
    }}>
      {/* Hotel Image with Wishlist Button & Badges */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '220px' }}>
        <img
          src={hotel.primaryImageUrl}
          alt={hotel.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />

        {/* Featured Tag */}
        {hotel.isFeatured && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#1e1b4b',
            color: '#38bdf8',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.725rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            <Sparkles size={12} /> BookNowGo Choice
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(hotel.id);
          }}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        >
          <Heart size={18} fill={wishlisted ? '#f43f5e' : 'none'} color={wishlisted ? '#f43f5e' : '#64748b'} />
        </button>

        {/* Photos count pill */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          color: 'white',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 600
        }}>
          {hotel.images?.length || 4} Photos
        </div>
      </div>

      {/* Middle Hotel Info Column */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Star rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.4rem' }}>
            {Array.from({ length: hotel.starRating || 4 }).map((_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.35rem', fontWeight: 600 }}>
              {hotel.starRating}-Star Hotel
            </span>
          </div>

          {/* Hotel Name */}
          <Link to={`/hotel/${hotel.slug}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.3,
              marginBottom: '0.4rem'
            }}>
              {hotel.name}
            </h3>
          </Link>

          {/* Location details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
            <MapPin size={15} color="#4f46e5" />
            <span>{hotel.area ? `${hotel.area}, ` : ''}{hotel.city}, {hotel.country}</span>
            {hotel.landmark && <span style={{ color: '#0ea5e9' }}>• Near {hotel.landmark}</span>}
          </div>

          {/* Key Amenities */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {hotel.amenities?.slice(0, 4).map((am, idx) => (
              <span key={idx} style={{
                backgroundColor: '#f1f5f9',
                color: 'var(--text-muted)',
                fontSize: '0.725rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontWeight: 500
              }}>
                {am}
              </span>
            ))}
          </div>

          {/* Cancellation perk */}
          {hotel.freeCancellation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle2 size={14} />
              <span>Free cancellation available</span>
            </div>
          )}
        </div>

        {/* Compare Checkbox */}
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={comparing}
              onChange={(e) => {
                if (e.target.checked) addToCompare(hotel);
                else removeFromCompare(hotel.id);
              }}
              style={{ width: '15px', height: '15px', accentColor: '#4f46e5', cursor: 'pointer' }}
            />
            <span>Compare with other hotels</span>
          </label>
        </div>
      </div>

      {/* Right Pricing & Ratings Column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderLeft: '1px solid #f1f5f9',
        paddingLeft: '1.25rem',
        textAlign: 'right'
      }}>
        {/* Rating Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {getRatingLabel(hotel.averageRating)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {hotel.reviewCount} verified reviews
            </div>
          </div>
          <div className="rating-badge">
            {hotel.averageRating.toFixed(1)}
          </div>
        </div>

        {/* Price Box */}
        <div style={{ width: '100%' }}>
          {hotel.discountPercentage > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-coral">
                Save {hotel.discountPercentage}%
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                {formatINR(hotel.originalPrice)}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>from</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.03em' }}>
              {formatINR(hotel.startingPrice)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ night</span>
          </div>

          <p style={{ fontSize: '0.725rem', color: 'var(--text-light)', marginBottom: '0.85rem' }}>
            Includes all taxes & platform fees
          </p>

          <Link
            to={`/hotel/${hotel.slug}`}
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}
          >
            <span>View Rooms</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
