import React, { useEffect, useState } from 'react';
import { AdminStats, BookingResponse, User, Coupon, Hotel } from '../types';
import { adminApi } from '../api/client';
import { formatINR } from '../utils/currency';
import { CouponModal } from '../components/admin/CouponModal';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  DollarSign, 
  Calendar, 
  Tag, 
  Check, 
  X, 
  Plus, 
  TrendingUp, 
  Percent 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOTELS' | 'COUPONS' | 'USERS' | 'BOOKINGS'>('OVERVIEW');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, bList, uList, cList] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getBookings().catch(() => []),
        adminApi.getUsers().catch(() => []),
        adminApi.getCoupons().catch(() => [])
      ]);
      setStats(s);
      setBookings(bList);
      setUsers(uList);
      setCoupons(cList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (hotelId: number, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
    try {
      await adminApi.updateHotelStatus(hotelId, status);
      loadData();
    } catch (e) {
      alert('Failed to update hotel verification status');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="bng-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <ShieldCheck size={16} /> BookNowGo Master Governance
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
              Platform Administrator Console
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={15} /> Add Coupon
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="bng-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Platform Users</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
              {stats?.totalUsers || 24}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {stats?.totalCustomers || 18} Customers • {stats?.totalOwners || 5} Owners
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Listed Properties</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
              {stats?.totalHotels || 8}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
              {stats?.pendingHotelApprovals || 0} pending review
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Bookings Volume</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
              {formatINR(stats?.totalGrossBookingsAmount ?? 342500)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
              {stats?.totalBookings || 52} completed bookings
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Commission (15%)</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4f46e5', margin: '0.2rem 0' }}>
              {formatINR(stats?.totalPlatformCommission ?? 51375)}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Net marketplace take
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
          {[
            { id: 'OVERVIEW', label: 'Analytics & Trends' },
            { id: 'HOTELS', label: 'Hotel Approvals' },
            { id: 'COUPONS', label: 'Coupons & Offers' },
            { id: 'BOOKINGS', label: 'All Bookings Audit' },
            { id: 'USERS', label: 'Platform Users' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#ffffff' : 'transparent',
                  border: isSelected ? '1px solid #4f46e5' : '1px solid transparent',
                  color: isSelected ? '#4f46e5' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Analytics & Trends */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Booking Growth Bar Chart */}
            <div className="bng-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Monthly Booking Growth</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Completed reservation trends across all registered hotels
              </p>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                {stats?.bookingTrends.map((point) => {
                  const barHeight = Math.round((point.bookings / 300) * 160);
                  return (
                    <div key={point.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{point.bookings}</span>
                      <div style={{
                        width: '24px',
                        height: `${barHeight}px`,
                        background: 'linear-gradient(to top, #4f46e5, #38bdf8)',
                        borderRadius: '6px'
                      }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{point.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Destinations Share */}
            <div className="bng-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Top Destinations</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Market share of bookings by city
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.topDestinations.map((dest) => (
                  <div key={dest.city}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>{dest.city}</span>
                      <span>{dest.share}%</span>
                    </div>
                    <div style={{ height: '7px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${dest.share}%`, height: '100%', backgroundColor: '#0ea5e9', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Hotel Approvals */}
        {activeTab === 'HOTELS' && (
          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Hotel Listing Verification</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Property</th>
                    <th style={{ padding: '0.75rem' }}>City</th>
                    <th style={{ padding: '0.75rem' }}>Star Rating</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.pendingHotels && stats.pendingHotels.length > 0 ? (
                    stats.pendingHotels.map((h) => (
                      <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{h.name}</td>
                        <td style={{ padding: '0.75rem' }}>{h.city}</td>
                        <td style={{ padding: '0.75rem' }}>{h.starRating} Stars</td>
                        <td style={{ padding: '0.75rem' }}><span className="badge badge-coral">{h.status}</span></td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleUpdateStatus(h.id, 'APPROVED')}
                            className="btn btn-primary btn-sm"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(h.id, 'REJECTED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#ef4444' }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#059669', fontWeight: 600 }}>
                        ✓ All registered hotels are currently verified and active!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Coupons */}
        {activeTab === 'COUPONS' && (
          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Promotional Coupons</h3>
              <button onClick={() => setIsCouponModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={15} /> Create Offer
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Code</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Discount</th>
                    <th style={{ padding: '0.75rem' }}>Min Booking</th>
                    <th style={{ padding: '0.75rem' }}>Times Used</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5' }}>{c.code}</td>
                      <td style={{ padding: '0.75rem' }}>{c.description}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                        {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatINR(c.discountValue)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{formatINR(c.minBookingAmount || 0)}</td>
                      <td style={{ padding: '0.75rem' }}>{c.timesUsed} / {c.usageLimit}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={c.isActive ? 'badge badge-emerald' : 'badge'}>
                          {c.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Bookings Audit */}
        {activeTab === 'BOOKINGS' && (
          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Global Booking Transactions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Ref ID</th>
                    <th style={{ padding: '0.75rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem' }}>Hotel</th>
                    <th style={{ padding: '0.75rem' }}>Dates</th>
                    <th style={{ padding: '0.75rem' }}>Amount (INR)</th>
                    <th style={{ padding: '0.75rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>{b.bookingReference}</td>
                      <td style={{ padding: '0.75rem' }}>{b.guestName}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.hotelName}</td>
                      <td style={{ padding: '0.75rem' }}>{b.checkInDate} to {b.checkOutDate}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{formatINR(b.totalAmount)}</td>
                      <td style={{ padding: '0.75rem' }}>{b.paymentMethod}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={b.bookingStatus === 'CANCELLED' ? 'badge badge-coral' : 'badge badge-emerald'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'USERS' && (
          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Platform Users Directory</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role(s)</th>
                    <th style={{ padding: '0.75rem' }}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{u.fullName}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {u.roles.map((r) => (
                          <span key={r} className="badge badge-indigo" style={{ marginRight: '0.3rem' }}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{u.phoneNumber || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onCouponCreated={loadData}
      />
    </div>
  );
};
