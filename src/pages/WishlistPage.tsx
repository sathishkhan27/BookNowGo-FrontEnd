import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '../types';
import { wishlistApi } from '../api/client';
import { HotelCard } from '../components/customer/HotelCard';
import { HotelCompareModal } from '../components/customer/HotelCompareModal';
import { Heart, Compass } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistApi.getWishlist()
      .then(setHotels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '3rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="bng-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff1f2', color: '#f43f5e', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={24} fill="#f43f5e" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              My Saved Wishlist
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Keep track of hotels you love, compare prices, and book when the time is right.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map((n) => (
              <div key={n} className="bng-card shimmer" style={{ height: '220px' }}></div>
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <div>
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '4rem 2rem', textAlign: 'center' }}>
            <Heart size={36} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Click the heart icon on any hotel card to save properties for your upcoming trips.
            </p>
            <Link to="/search" className="btn btn-primary">
              <Compass size={16} />
              <span>Explore Top Hotels</span>
            </Link>
          </div>
        )}
      </div>

      <HotelCompareModal />
    </div>
  );
};
