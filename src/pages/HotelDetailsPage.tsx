import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HotelDetail, Room } from '../types';
import { hotelApi } from '../api/client';
import { RoomCard } from '../components/customer/RoomCard';
import { ReviewModal } from '../components/customer/ReviewModal';
import { useWishlist } from '../context/WishlistContext';
import { 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  Check, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export const HotelDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Default booking dates
  const today = new Date();
  const defaultCheckIn = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  const defaultCheckOut = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [roomsCount, setRoomsCount] = useState(1);

  const { isWishlisted, toggleWishlist } = useWishlist();

  const fetchHotel = () => {
    if (!slug) return;
    setLoading(true);
    hotelApi.getBySlug(slug)
      .then((data) => {
        setHotel(data);
        setActiveImage(data.primaryImageUrl);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotel();
  }, [slug]);

  if (loading) {
    return (
      <div className="bng-container" style={{ padding: '4rem 0' }}>
        <div className="shimmer" style={{ height: '400px', borderRadius: '16px', marginBottom: '2rem' }}></div>
        <div className="shimmer" style={{ height: '60px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="bng-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Hotel not found</h2>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(hotel.id);

  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Breadcrumb Header */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
        <div className="bng-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={13} />
          <Link to={`/search?query=${encodeURIComponent(hotel.city || hotel.name)}`} style={{ color: 'var(--text-muted)' }}>{hotel.city || hotel.name}</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{hotel.name}</span>
        </div>
      </div>

      <div className="bng-container" style={{ paddingTop: '1.75rem' }}>
        {/* Title & Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span className="badge badge-indigo" style={{ marginLeft: '0.4rem' }}>
                {hotel.starRating}-Star Luxury Hotel
              </span>
              {hotel.isFeatured && (
                <span className="badge badge-emerald">
                  <Sparkles size={12} /> BookNowGo Choice
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              {hotel.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <MapPin size={16} color="#4f46e5" />
              <span>{hotel.address}{hotel.area ? `, ${hotel.area}` : ''}{hotel.city ? `, ${hotel.city}` : ''}{hotel.country ? `, ${hotel.country}` : ''}</span>
              {hotel.landmark && <span style={{ color: '#0ea5e9' }}>• Near {hotel.landmark}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => toggleWishlist(hotel.id)}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Heart size={16} fill={wishlisted ? '#f43f5e' : 'none'} color={wishlisted ? '#f43f5e' : 'currentColor'} />
              <span>{wishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Hotel link copied to clipboard!');
                }
              }}
              className="btn btn-outline"
            >
              <Share2 size={16} />
            </button>

            <a href="#available-rooms" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', fontWeight: 700 }}>
              Select Room
            </a>
          </div>
        </div>

        {/* Dynamic Gallery Grid */}
        {(() => {
          const hotelImages = (hotel.images && hotel.images.length > 0) ? hotel.images : [hotel.primaryImageUrl];
          return (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: hotelImages.length > 1 ? '2.5fr 1fr' : '1fr',
                gap: '1rem',
                height: '460px',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Main Large Image */}
                <div style={{ height: '100%', position: 'relative' }}>
                  <img
                    src={activeImage || hotel.primaryImageUrl}
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: 'white',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {hotelImages.length} Property Photos
                  </div>
                </div>

                {/* Side Thumbnail List */}
                {hotelImages.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateRows: `repeat(${Math.min(3, hotelImages.length)}, 1fr)`, gap: '0.75rem', height: '100%' }}>
                    {hotelImages.slice(0, 3).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImage(imgUrl)}
                        style={{
                          height: '100%',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: (activeImage || hotel.primaryImageUrl) === imgUrl ? '3px solid #4f46e5' : '1px solid var(--border)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <img src={imgUrl} alt={`${hotel.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extended Thumbnail Strip if more than 3 photos */}
              {hotelImages.length > 3 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
                  {hotelImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      style={{
                        minWidth: '85px',
                        height: '55px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: (activeImage || hotel.primaryImageUrl) === imgUrl ? '2px solid #4f46e5' : '1px solid var(--border)',
                        opacity: (activeImage || hotel.primaryImageUrl) === imgUrl ? 1 : 0.75
                      }}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Stay Dates Banner */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#4f46e5" />
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, padding: 0, fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#0ea5e9" />
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, padding: 0, fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Rooms</label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, padding: 0, fontSize: '0.9rem' }}
              >
                <option value={1}>1 Room</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3 Rooms</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} />
            <span>Prices include free cancellation & all taxes</span>
          </div>
        </div>

        {/* 2-Column Overview & Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            {/* Description */}
            <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>About this Property</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {hotel.description}
              </p>

              {/* Check-in / check-out times */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#4f46e5" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Check-in</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>From {hotel.checkInTime}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#f43f5e" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Check-out</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Until {hotel.checkOutTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Amenities Grid */}
            <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Property Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {hotel.amenities.map((am, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} />
                    </div>
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Verified Ratings Box */}
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Guest Ratings</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on {hotel.reviewCount} verified reviews</p>
                </div>
                <div className="rating-badge" style={{ fontSize: '1.25rem', padding: '0.4rem 0.8rem' }}>
                  {hotel.averageRating.toFixed(1)}
                </div>
              </div>

              {/* Review metrics computed dynamically from API reviews */}
              {(() => {
                const reviews = hotel.reviews || [];
                const calcAvg = (key: 'cleanlinessRating' | 'locationRating' | 'serviceRating' | 'valueRating') => {
                  const rated = reviews.filter((r) => typeof r[key] === 'number' && (r[key] as number) > 0);
                  if (rated.length === 0) return null;
                  const total = rated.reduce((sum, r) => sum + (r[key] as number), 0);
                  return parseFloat((total / rated.length).toFixed(1));
                };

                const categories = [
                  { label: 'Cleanliness', score: calcAvg('cleanlinessRating') },
                  { label: 'Location & Surroundings', score: calcAvg('locationRating') },
                  { label: 'Staff & Hospitality', score: calcAvg('serviceRating') },
                  { label: 'Value for Money', score: calcAvg('valueRating') }
                ].filter((cat): cat is { label: string; score: number } => cat.score !== null);

                if (categories.length > 0) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {categories.map((item, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                            <span>{item.label}</span>
                            <span>{item.score} / 10</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.score * 10}%`, height: '100%', backgroundColor: '#4f46e5', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div style={{ padding: '0.5rem 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Verified guest rating: <strong>{hotel.averageRating.toFixed(1)} / 10</strong> from {hotel.reviewCount} reviews.
                  </div>
                );
              })()}

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="btn btn-outline"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <MessageSquare size={16} />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <section id="available-rooms" style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Available Rooms
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Choose your preferred room type. Rates include taxes and meal plan as specified.
            </p>
          </div>

          <div>
            {hotel.rooms && hotel.rooms.length > 0 ? (
              hotel.rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hotel={hotel}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  roomsCount={roomsCount}
                />
              ))
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px dashed var(--border)', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  No Room Types Currently Listed
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                  The property owner has not published room inventory yet. Please check back shortly or explore other verified stays.
                </p>
                <Link to="/search" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Browse Nearby Stays
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Verified Customer Reviews */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Verified Customer Reviews</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real feedback from real guests who completed their stay</p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              Add Your Review
            </button>
          </div>

          {hotel.reviews && hotel.reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {hotel.reviews.map((rev) => (
                <div key={rev.id} style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                        alt={rev.userName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.userName}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Verified Stay • {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="rating-badge" style={{ fontSize: '0.85rem' }}>
                      {rev.overallRating.toFixed(1)}
                    </div>
                  </div>

                  {rev.headline && (
                    <h5 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      "{rev.headline}"
                    </h5>
                  )}

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No reviews yet. Be the first to review after your stay!
            </p>
          )}
        </section>
      </div>

      {/* Review Modal */}
      <ReviewModal
        hotelId={hotel.id}
        hotelName={hotel.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchHotel}
      />
    </div>
  );
};
