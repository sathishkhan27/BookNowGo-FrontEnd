import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingResponse, RefundResponse } from '../types';
import { bookingApi } from '../api/client';
import { formatINR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Building, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  DollarSign,
  ChevronRight 
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  // Cancel modal state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingResponse | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState<RefundResponse | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    bookingApi.getMyBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'CANCELLED') {
      return b.bookingStatus === 'CANCELLED';
    }
    if (activeTab === 'COMPLETED') {
      return b.bookingStatus !== 'CANCELLED' && b.checkOutDate < today;
    }
    // UPCOMING
    return b.bookingStatus !== 'CANCELLED' && b.checkOutDate >= today;
  });

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setIsCancelling(true);
    try {
      const res = await bookingApi.cancelBooking(selectedBookingForCancel.bookingReference, cancelReason);
      setCancelResult(res);
      fetchBookings();
    } catch (e: any) {
      alert(e.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '3rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="bng-container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            My Bookings & Reservations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage upcoming stays, download confirmation invoices, or request policy-based refunds.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'UPCOMING', label: 'Upcoming Stays' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled & Refunded' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid #4f46e5' : '1px solid transparent',
                  backgroundColor: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#4f46e5' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map((n) => (
              <div key={n} className="bng-card shimmer" style={{ height: '180px' }}></div>
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredBookings.map((b) => {
              const isCancelled = b.bookingStatus === 'CANCELLED';
              return (
                <div key={b.id} className="bng-card" style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 240px) 1fr minmax(200px, 240px)',
                  gap: '1.5rem',
                  backgroundColor: '#ffffff'
                }}>
                  {/* Image */}
                  <div style={{ borderRadius: '10px', overflow: 'hidden', height: '150px' }}>
                    <img src={b.hotelImage} alt={b.hotelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className={isCancelled ? 'badge badge-coral' : 'badge badge-emerald'}>
                          {b.bookingStatus}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          Ref: {b.bookingReference}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {b.hotelName}
                      </h3>

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.6rem' }}>
                        <MapPin size={14} color="#4f46e5" />
                        <span>{b.hotelAddress}, {b.hotelCity}</span>
                      </p>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                        <strong>{b.roomName}</strong> • {b.totalNights} Nights • {b.adults} Adults
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <span>Check-in: <strong>{b.checkInDate}</strong></span>
                      <span>Check-out: <strong>{b.checkOutDate}</strong></span>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', borderLeft: '1px solid #f1f5f9', paddingLeft: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Paid Total</span>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                        {formatINR(b.totalAmount)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                      <Link
                        to={`/booking-confirmation/${b.bookingReference}`}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        View Voucher
                      </Link>

                      {!isCancelled && (
                        <button
                          onClick={() => {
                            setSelectedBookingForCancel(b);
                            setCancelResult(null);
                          }}
                          className="btn btn-sm"
                          style={{ color: '#ef4444', border: '1px solid #fecdd3', backgroundColor: '#fff1f2' }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '4rem 2rem', textAlign: 'center' }}>
            <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No bookings found in this tab</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
              Explore our curated hotels and book your next vacation escape!
            </p>
            <Link to="/search" className="btn btn-primary">
              Discover Stays
            </Link>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {selectedBookingForCancel && (
        <div className="modal-overlay" onClick={() => setSelectedBookingForCancel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Cancellation</h3>
              </div>
              <button onClick={() => setSelectedBookingForCancel(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {cancelResult ? (
              <div>
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Cancellation Processed</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Refund Reference: <strong>{cancelResult.refundReference}</strong>
                  </p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span>Original Amount:</span>
                    <strong>{formatINR(cancelResult.originalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#ef4444' }}>
                    <span>Cancellation Retention:</span>
                    <span>-{formatINR(cancelResult.cancellationFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.4rem', color: '#059669', fontWeight: 700 }}>
                    <span>Refund Issued to Original Payment:</span>
                    <span>{formatINR(cancelResult.refundAmount)}</span>
                  </div>
                </div>

                <button onClick={() => setSelectedBookingForCancel(null)} className="btn btn-primary" style={{ width: '100%' }}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Are you sure you want to cancel your stay at <strong>{selectedBookingForCancel.hotelName}</strong> ({selectedBookingForCancel.checkInDate} to {selectedBookingForCancel.checkOutDate})?
                </p>

                <div style={{ backgroundColor: '#ecfdf5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.825rem', color: '#065f46', marginBottom: '1.25rem' }}>
                  <strong>Cancellation Policy:</strong> Free cancellation up to 24h prior to check-in. Full refund of {formatINR(selectedBookingForCancel.totalAmount)} will be initiated.
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Reason for cancellation
                  </label>
                  <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ width: '100%' }}>
                    <option value="Change of travel plans">Change of travel plans</option>
                    <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                    <option value="Personal emergency">Personal emergency</option>
                    <option value="Destination weather / safety concerns">Destination weather / safety concerns</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setSelectedBookingForCancel(null)} className="btn btn-outline">
                    Keep Booking
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="btn btn-coral"
                  >
                    {isCancelling ? 'Processing...' : 'Confirm & Refund'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
