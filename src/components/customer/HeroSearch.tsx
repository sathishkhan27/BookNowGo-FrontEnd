import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';

interface HeroSearchProps {
  initialQuery?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
  initialRooms?: number;
  compact?: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  initialQuery = '',
  initialCheckIn = '',
  initialCheckOut = '',
  initialAdults = 2,
  initialChildren = 0,
  initialRooms = 1,
  compact = false
}) => {
  const navigate = useNavigate();

  // Tomorrow & 3 days from now default
  const getDefaultDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [query, setQuery] = useState(initialQuery);
  const [checkIn, setCheckIn] = useState(initialCheckIn || getDefaultDate(1));
  const [checkOut, setCheckOut] = useState(initialCheckOut || getDefaultDate(4));
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [rooms, setRooms] = useState(initialRooms);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: query.trim(),
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString()
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: compact ? '12px' : '16px',
        padding: compact ? '0.75rem' : '1.25rem',
        boxShadow: compact ? 'var(--shadow-md)' : '0 20px 30px -10px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
        gap: '0.75rem',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Destination / Hotel search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: '#f8fafc'
      }}>
        <MapPin size={22} color="#4f46e5" />
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Destination / Hotel
          </label>
          <input
            type="text"
            placeholder="e.g. Goa, Paris, Dubai, Mumbai"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>

      {/* Check In Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: '#f8fafc'
      }}>
        <Calendar size={22} color="#0ea5e9" />
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>

      {/* Check Out Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: '#f8fafc'
      }}>
        <Calendar size={22} color="#0ea5e9" />
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>

      {/* Guests & Rooms */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setGuestPopoverOpen(!guestPopoverOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: '#f8fafc',
            cursor: 'pointer'
          }}
        >
          <Users size={22} color="#10b981" />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Guests & Rooms
            </label>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{adults} Adults, {rooms} Room{rooms > 1 ? 's' : ''}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Guest Popover Selector */}
        {guestPopoverOpen && (
          <div style={{
            position: 'absolute',
            top: '115%',
            left: 0,
            right: 0,
            minWidth: '260px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border)',
            padding: '1rem',
            zIndex: 100
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rooms</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >-</button>
                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{rooms}</span>
                <button
                  type="button"
                  onClick={() => setRooms(rooms + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >+</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Adults</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >-</button>
                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >+</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Children</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >-</button>
                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 700 }}
                >+</button>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => setGuestPopoverOpen(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Submit Search Button */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          padding: compact ? '0.75rem 1.25rem' : '0.9rem 1.75rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: '10px'
        }}
      >
        <Search size={20} />
        <span>Search Hotels</span>
      </button>
    </form>
  );
};
