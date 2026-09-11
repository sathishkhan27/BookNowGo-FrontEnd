import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { BookingResponse } from '../types';
import { bookingApi } from '../api/client';
import { formatINR } from '../utils/currency';
import { CheckCircle2, Printer, Calendar, MapPin, Download, ArrowRight, Building, ShieldCheck } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const location = useLocation();
  const stateBooking = (location.state as any)?.booking as BookingResponse | undefined;

  const [booking, setBooking] = useState<BookingResponse | null>(stateBooking || null);
  const [loading, setLoading] = useState(!stateBooking);

  useEffect(() => {
    if (!booking && reference) {
      bookingApi.getByReference(reference)
        .then(setBooking)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [reference, booking]);

  if (loading) {
    return (
      <div className="bng-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="shimmer" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}></div>
        <h2>Loading your booking confirmation...</h2>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bng-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Booking confirmation not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '3rem 0 6rem 0' }}>
      <div className="bng-container" style={{ maxWidth: '850px' }}>
        {/* Success Header Box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem', fontSize: '0.825rem' }}>
            Reservation Confirmed & Paid
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Thank You, {booking.guestName}!
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Your room at <strong>{booking.hotelName}</strong> is reserved. We've sent the complete itinerary and voucher to <strong>{booking.guestEmail}</strong>.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: '#f1f5f9',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Booking Reference:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              {booking.bookingReference}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-outline btn-sm">
              <Printer size={15} />
              <span>Print Voucher</span>
            </button>
            <Link to="/my-bookings" className="btn btn-primary btn-sm">
              <span>View in My Bookings</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Official Printable Hotel Voucher */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Voucher Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                BookNow<span style={{ color: '#0ea5e9' }}>Go</span> Voucher
              </span>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div>Status: <strong style={{ color: '#059669' }}>{booking.bookingStatus}</strong></div>
              <div>Date Issued: {new Date(booking.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Hotel & Stay Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                {booking.hotelName}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="#4f46e5" />
                <span>{booking.hotelAddress}, {booking.hotelCity}</span>
              </p>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                <p><strong>Room Category:</strong> {booking.roomName} ({booking.roomType})</p>
                <p><strong>Bed Type:</strong> {booking.bedType}</p>
                <p><strong>Meal Inclusions:</strong> {booking.mealPlan}</p>
                <p><strong>Occupancy:</strong> {booking.adults} Adults, {booking.children} Children ({booking.numberOfRooms} Room)</p>
              </div>
            </div>

            {/* Check-in box */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Check-in</span>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{booking.checkInDate}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {booking.checkInTime}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Check-out</span>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{booking.checkOutDate}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Until {booking.checkOutTime}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Duration: <strong>{booking.totalNights} Nights</strong>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Payment Receipt</div>
              <div style={{ fontSize: '0.85rem' }}>Method: <strong>{booking.paymentMethod}</strong></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Txn Reference: {booking.transactionReference}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Paid (Taxes Included)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatINR(booking.totalAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
