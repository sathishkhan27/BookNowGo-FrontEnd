import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room, HotelDetail } from '../../types';
import { formatINR } from '../../utils/currency';
import { Users, Bed, Square, Check, Utensils, ShieldCheck, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  hotel: HotelDetail;
  checkIn: string;
  checkOut: string;
  roomsCount?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hotel,
  checkIn,
  checkOut,
  roomsCount = 1
}) => {
  const navigate = useNavigate();
  const roomImages = (room.images && room.images.length > 0) ? room.images : [room.primaryImageUrl];
  const [selectedImg, setSelectedImg] = useState(room.primaryImageUrl || roomImages[0]);

  const handleBookNow = () => {
    navigate('/checkout', {
      state: {
        hotel,
        room,
        checkIn,
        checkOut,
        roomsCount
      }
    });
  };

  const effectivePrice = room.discountedPrice && room.discountedPrice < room.basePrice
    ? room.discountedPrice
    : room.basePrice;

  return (
    <div className="bng-card" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(260px, 300px) 1fr minmax(220px, 260px)',
      gap: '1.25rem',
      padding: '1.25rem',
      marginBottom: '1rem',
      backgroundColor: '#ffffff'
    }}>
      {/* Room Image & Dynamic Thumbnails */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ borderRadius: '10px', overflow: 'hidden', height: '170px', position: 'relative' }}>
          <img
            src={selectedImg}
            alt={room.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          />
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(30, 27, 75, 0.85)',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.725rem',
            fontWeight: 700
          }}>
            {room.roomType}
          </div>
        </div>

        {/* Thumbnail switcher if owner uploaded multiple room photos */}
        {roomImages.length > 1 && (
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            {roomImages.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImg(img)}
                style={{
                  width: '45px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedImg === img ? '2px solid #4f46e5' : '1px solid var(--border)',
                  opacity: selectedImg === img ? 1 : 0.65
                }}
              >
                <img src={img} alt={`Room thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Details Column */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {room.name}
          </h3>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
            {room.description || `${room.roomType} suite offering exceptional luxury and comfort.`}
          </p>

          {/* Key Specs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bed size={16} color="#4f46e5" />
              <span>{room.bedType}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={16} color="#0ea5e9" />
              <span>Up to {room.maxAdults} Adults, {room.maxChildren} Child</span>
            </div>
            {room.roomSizeSqft && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Square size={16} color="#10b981" />
                <span>{room.roomSizeSqft} sq.ft</span>
              </div>
            )}
          </div>

          {/* Amenities pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {room.amenities?.map((am, i) => (
              <span key={i} style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.725rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                color: 'var(--text-muted)'
              }}>
                {am}
              </span>
            ))}
          </div>

          {/* Perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600 }}>
              <Utensils size={14} />
              <span>{room.mealPlan}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7' }}>
              <ShieldCheck size={14} />
              <span>{room.cancellationPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing in INR & CTA Column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderLeft: '1px solid #f1f5f9',
        paddingLeft: '1.25rem',
        textAlign: 'right'
      }}>
        <div style={{ width: '100%' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            Instant Confirmation
          </div>

          {room.discountPercentage ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-coral">Save {room.discountPercentage}%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatINR(room.basePrice)}
              </span>
            </div>
          ) : null}

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Price per night
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
              {formatINR(effectivePrice)}
            </span>
          </div>

          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            +12% GST & 5% Service Fee
          </p>
        </div>

        <button
          onClick={handleBookNow}
          className="btn btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
        >
          <span>Reserve Room</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
