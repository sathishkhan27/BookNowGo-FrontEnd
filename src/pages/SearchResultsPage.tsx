import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSearch } from '../components/customer/HeroSearch';
import { HotelCard } from '../components/customer/HotelCard';
import { HotelFilters } from '../components/customer/HotelFilters';
import { HotelCompareModal } from '../components/customer/HotelCompareModal';
import { MapViewModal } from '../components/customer/MapViewModal';
import { Hotel, HotelSearchFilters } from '../types';
import { searchApi } from '../api/client';
import { Map, ArrowUpDown, SlidersHorizontal, Building2 } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const rooms = parseInt(searchParams.get('rooms') || '1');

  const [filters, setFilters] = useState<HotelSearchFilters>({
    query,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    sortBy: 'recommended'
  });

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query,
      checkIn,
      checkOut,
      adults,
      children,
      rooms
    }));
  }, [query, checkIn, checkOut, adults, children, rooms]);

  useEffect(() => {
    setLoading(true);
    searchApi.searchHotels(filters)
      .then(setHotels)
      .catch((err) => {
        console.error('Search error:', err);
        setHotels([]);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      sortBy: 'recommended'
    });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', paddingBottom: '4rem' }}>
      {/* Sticky Compact Search Header */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="bng-container">
          <HeroSearch
            initialQuery={query}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialAdults={adults}
            initialChildren={children}
            initialRooms={rooms}
            compact
          />
        </div>
      </div>

      <div className="bng-container" style={{ paddingTop: '2rem' }}>
        {/* Sub-header with Results Count, Sort, and Map View Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {query ? `Hotels in "${query}"` : 'All Available Stays'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {loading ? 'Searching properties...' : `Found ${hotels.length} verified hotel properties matching your criteria`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Map View Toggle Button */}
            <button
              onClick={() => setIsMapOpen(true)}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <Map size={16} color="#4f46e5" />
              <span>Show on Map</span>
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.4rem 0.75rem' }}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</label>
              <select
                value={filters.sortBy || 'recommended'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
                <option value="stars">Star Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filters + Hotel Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left Filters Sidebar */}
          <aside className="hide-on-mobile">
            <HotelFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Hotel Results List */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[1, 2, 3].map((n) => (
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
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                padding: '4rem 2rem',
                textAlign: 'center'
              }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--text-muted)' }}>
                  <Building2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  No hotels match your filters
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
                  Try relaxing your price filters, selecting fewer amenities, or searching for a broader location like "Goa" or "Paris".
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <HotelCompareModal />

      {/* Interactive Map Modal */}
      <MapViewModal
        hotels={hotels}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
    </div>
  );
};
