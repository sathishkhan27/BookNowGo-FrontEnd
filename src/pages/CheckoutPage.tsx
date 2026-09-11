import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { HotelDetail, Room, FareBreakdown } from '../types';
import { useAuth } from '../context/AuthContext';
import { searchApi, bookingApi, couponApi } from '../api/client';
import { formatINR, calculateINRFare } from '../utils/currency';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Tag, 
  Check, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Users, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const state = location.state as {
    hotel?: HotelDetail;
    room?: Room;
    checkIn?: string;
    checkOut?: string;
    roomsCount?: number;
  } | undefined;

  const hotel = state?.hotel;
  const room = state?.room;
  const checkIn = state?.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const checkOut = state?.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const roomsCount = state?.roomsCount || 1;

  // Guest details form
  const [guestName, setGuestName] = useState(user?.fullName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phoneNumber || '');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Fare breakdown calculation
  const [fare, setFare] = useState<FareBreakdown | null>(null);
  const [calculatingFare, setCalculatingFare] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!room) return;
    setCalculatingFare(true);

    // Dynamic INR Calculation
    const effectiveBasePrice = room.discountedPrice || room.basePrice;
    const computedLocalFare = calculateINRFare({
      basePricePerNight: effectiveBasePrice,
      checkIn,
      checkOut,
      roomsCount,
      discountPercentage: room.discountPercentage || 0,
      couponDiscount: appliedCoupon ? 1000 : 0,
      couponCode: appliedCoupon || undefined
    });
    setFare(computedLocalFare);

    searchApi.getFarePreview(room.id, checkIn, checkOut, roomsCount, appliedCoupon || undefined)
      .then((data) => {
        if (data && data.finalTotalAmount) {
          setFare(data);
        }
      })
      .catch((err) => console.log('Using dynamic client INR fare:', err))
      .finally(() => setCalculatingFare(false));
  }, [room, checkIn, checkOut, roomsCount, appliedCoupon]);

  if (!hotel || !room) {
    return (
      <div className="bng-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>No booking in progress</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Please select a hotel and room type first.</p>
        <Link to="/search" className="btn btn-primary">
          Explore Hotels
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      const val = await couponApi.validate(couponInput.trim(), fare?.totalRoomBasePrice || 100);
      if (val.valid) {
        setAppliedCoupon(couponInput.trim().toUpperCase());
        setCouponMessage(val.message);
      } else {
        setCouponMessage(val.message);
      }
    } catch (e: any) {
      setCouponMessage(e.message || 'Could not validate coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      setErrorMessage('Please fill in all primary guest contact information');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await bookingApi.createBooking({
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfRooms: roomsCount,
        adults,
        children,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        couponCode: appliedCoupon || undefined,
        paymentMethod
      });

      navigate(`/booking-confirmation/${response.bookingReference}`, {
        state: { booking: response }
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 0 5rem 0' }}>
      <div className="bng-container">
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Complete Your Reservation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Instant confirmation • Guaranteed best rate • Free cancellation
          </p>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecdd3',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left Column: Form Steps */}
          <div>
            {/* Step 1: Guest Details Form */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Lead Guest Details</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Email for Confirmation Voucher *
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Adults
                  </label>
                  <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value))} style={{ width: '100%' }}>
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Children
                  </label>
                  <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} style={{ width: '100%' }}>
                    <option value={0}>0 Children</option>
                    <option value={1}>1 Child</option>
                    <option value={2}>2 Children</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Quiet high floor room, early check-in preference, airport transfer inquiry..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Step 2: Payment Simulator */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Payment Method</h3>
              </div>

              {/* Payment Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
                  { id: 'WALLET', label: 'Wallets', icon: Wallet }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #4f46e5' : '1px solid var(--border)',
                        backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        color: isSelected ? '#4f46e5' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Fields */}
              {paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', fontFamily: 'monospace', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: '100%', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        maxLength={4}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: '100%', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              ) : paymentMethod === 'UPI' ? (
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Enter UPI ID (e.g. mobile@upi)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#059669', display: 'block', marginTop: '0.4rem' }}>
                    ✓ Instant verification via Google Pay / PhonePe / Paytm
                  </span>
                </div>
              ) : (
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  You will be securely redirected to your bank portal to finalize payment.
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '1rem' }}>
                <Lock size={14} color="#10b981" />
                <span>256-bit SSL encrypted. Sensitive card details are never stored on BookNowGo.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hotel & Stay Summary + Price Breakdown */}
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Booking Summary</h3>

              {/* Property summary */}
              <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                <img
                  src={hotel.primaryImageUrl}
                  alt={hotel.name}
                  style={{ width: '85px', height: '85px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {hotel.name}
                  </h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {hotel.city}, {hotel.country}
                  </p>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                    {room.name} ({room.roomType})
                  </span>
                </div>
              </div>

              {/* Stay Dates */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Check-in:</span>
                  <strong>{checkIn} ({hotel.checkInTime})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Check-out:</span>
                  <strong>{checkOut} ({hotel.checkOutTime})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                  <strong>{fare?.numberOfNights || 2} Nights, {roomsCount} Room</strong>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Have a Coupon or Promo Code?
                </label>
                {appliedCoupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Tag size={15} />
                      <span>{appliedCoupon} Applied!</span>
                    </div>
                    <button onClick={handleRemoveCoupon} style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. SUMMER50"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ flex: 1, textTransform: 'uppercase', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn btn-outline btn-sm">
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p style={{ fontSize: '0.75rem', color: appliedCoupon ? '#059669' : '#e11d48', marginTop: '0.3rem' }}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Room Price ({fare?.numberOfNights} nights x {roomsCount} room):</span>
                  <span>{formatINR(fare?.totalRoomBasePrice)}</span>
                </div>

                {fare?.discountAmount && fare.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                    <span>Promotional Room Discount:</span>
                    <span>-{formatINR(fare.discountAmount)}</span>
                  </div>
                )}

                {fare?.couponDiscount && fare.couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e11d48', fontWeight: 600 }}>
                    <span>Coupon Voucher ({appliedCoupon}):</span>
                    <span>-{formatINR(fare.couponDiscount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Taxes & GST (12%):</span>
                  <span>{formatINR(fare?.taxAmount)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Service & Concierge Fee (5%):</span>
                  <span>{formatINR(fare?.serviceFee)}</span>
                </div>

                <div style={{
                  borderTop: '2px dashed var(--border)',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Payable (INR):</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                    {formatINR(fare?.finalTotalAmount)}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting || calculatingFare}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem', fontWeight: 800 }}
              >
                {isSubmitting ? 'Processing Payment...' : `Pay ${formatINR(fare?.finalTotalAmount)} & Confirm`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
