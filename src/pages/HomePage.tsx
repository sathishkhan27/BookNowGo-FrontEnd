import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroSearch } from '../components/customer/HeroSearch';
import { HotelCard } from '../components/customer/HotelCard';
import { DestinationWithCount, Hotel, Coupon } from '../types';
import { hotelApi, locationApi, couponApi } from '../api/client';
import { formatINR } from '../utils/currency';
import { Sparkles, Compass, ShieldCheck, Tag, ArrowRight, Star, HeartHandshake } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationWithCount[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      locationApi.getPopular().catch(() => []),
      hotelApi.getFeatured().catch(() => []),
      couponApi.getActive().catch(() => [])
    ]).then(([dests, hotels, cpns]) => {
      setDestinations(dests);
      setFeaturedHotels(hotels);
      setCoupons(cpns);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        backgroundColor: '#1e1b4b',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 0 6rem 0',
        color: '#ffffff'
      }}>
        <div className="bng-container">
          <div style={{ maxWidth: '800px', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Sparkles size={15} />
              BookNowGo Hotel Room Platform
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1rem'
            }}>
              Discover & Compare Exceptional Stays at the <span style={{ color: '#38bdf8' }}>Guaranteed Best Rates</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Compare verified boutique retreats, 5-star beachfront resorts, and downtown suites across top destinations with transparent pricing.
            </p>
          </div>

          {/* Hero Search Box */}
          <HeroSearch />
        </div>
      </section>

      {/* Special Deals & Promotional Offers */}
      {coupons.length > 0 && (
        <section id="deals" style={{ backgroundColor: '#fff1f2', borderBottom: '1px solid #fecdd3', padding: '1.25rem 0' }}>
          <div className="bng-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#f43f5e', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
                <Tag size={20} />
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#9f1239', fontSize: '0.95rem', display: 'block' }}>
                  Exclusive BookNowGo Member Offers
                </span>
                <span style={{ fontSize: '0.825rem', color: '#be123c' }}>
                  Use code <strong style={{ textDecoration: 'underline' }}>{coupons[0]?.code}</strong> for {coupons[0]?.description}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {coupons.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/search')}
                  style={{
                    backgroundColor: 'white',
                    border: '1px dashed #f43f5e',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#e11d48',
                    cursor: 'pointer'
                  }}
                >
                  {c.code}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      <section id="destinations" style={{ padding: '4.5rem 0 3rem 0' }}>
        <div className="bng-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trending Getaways
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
                Popular Destinations
              </h2>
            </div>
            <Link to="/search" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>View All Cities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {destinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => navigate(`/search?query=${encodeURIComponent(dest.city)}`)}
                className="bng-card"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: '320px',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={dest.cityImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'}
                  alt={dest.city}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem'
                }}>
                  <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {dest.country}
                  </span>
                  <h3 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0' }}>
                    {dest.city}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                    <span>{dest.hotelCount} properties</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>from {formatINR(dest.startingPrice)}/night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section style={{ padding: '3rem 0 5rem 0', backgroundColor: '#f1f5f9' }}>
        <div className="bng-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Handpicked Stays
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
                Featured Properties
              </h2>
            </div>
            <Link to="/search" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            {featuredHotels.slice(0, 4).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Why BookNowGo Value Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="bng-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The BookNowGo Advantage
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Why Millions Trust BookNowGo
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
              We simplify hotel discovery with transparent all-in fares, authentic verified ratings, and guaranteed flexible policies.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Unbiased Price Discovery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Compare room types, meal plans, and real-time prices across verified hotel properties to ensure you get the best deal.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Zero Hidden Surprises</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every single rate clearly includes taxes and fees upfront before checkout. No deceptive resort fees at check-in.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Flexible Cancellation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Plans change unexpectedly. Enjoy free cancellation on eligible rooms up to 24 hours before check-in with automatic refunds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
