import React, { useEffect, useState } from 'react';
import { OwnerStats, Hotel, BookingResponse, Room, HotelDetail } from '../types';
import { ownerApi, hotelApi } from '../api/client';
import { InventoryCalendar } from '../components/owner/InventoryCalendar';
import { AddRoomModal } from '../components/owner/AddRoomModal';
import { EditRoomModal } from '../components/owner/EditRoomModal';
import { CreateHotelModal } from '../components/owner/CreateHotelModal';
import { EditHotelModal } from '../components/owner/EditHotelModal';
import { formatINR } from '../utils/currency';
import { 
  Building2, 
  IndianRupee, 
  Calendar, 
  TrendingUp, 
  Star, 
  Plus, 
  Bed, 
  Edit3, 
  Trash2, 
  Image, 
  Sparkles,
  Users,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | HotelDetail | null>(null);
  const [hotelRooms, setHotelRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateHotelOpen, setIsCreateHotelOpen] = useState(false);
  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const loadData = async (preferredHotelId?: number) => {
    setLoading(true);
    try {
      const [s, hList, bList] = await Promise.all([
        ownerApi.getStats().catch(() => null),
        ownerApi.getHotels().catch(() => []),
        ownerApi.getBookings().catch(() => [])
      ]);
      setStats(s);
      setHotels(hList);
      setBookings(bList);

      if (hList.length > 0) {
        const targetHotel = preferredHotelId 
          ? (hList.find(h => h.id === preferredHotelId) || hList[0])
          : (selectedHotel ? (hList.find(h => h.id === selectedHotel.id) || hList[0]) : hList[0]);
        
        setSelectedHotel(targetHotel);
        await loadRoomsForHotel(targetHotel.id);
      } else {
        setSelectedHotel(null);
        setHotelRooms([]);
        setSelectedRoom(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForHotel = async (hotelId: number) => {
    try {
      // First try ownerApi.getRooms, fallback to hotelApi.getById
      let rooms: Room[] = [];
      try {
        rooms = await ownerApi.getRooms(hotelId);
      } catch {
        const detail = await hotelApi.getById(hotelId);
        rooms = detail.rooms || [];
        setSelectedHotel(detail);
      }
      setHotelRooms(rooms);
      if (rooms.length > 0) {
        setSelectedRoom(prev => (prev ? (rooms.find(r => r.id === prev.id) || rooms[0]) : rooms[0]));
      } else {
        setSelectedRoom(null);
      }
    } catch (e) {
      console.error('Error fetching rooms:', e);
      setHotelRooms([]);
      setSelectedRoom(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectHotel = async (h: Hotel) => {
    setSelectedHotel(h);
    await loadRoomsForHotel(h.id);
  };

  const handleDeleteRoom = async (roomId: number, roomName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await ownerApi.deleteRoom(roomId);
      if (selectedHotel) {
        await loadRoomsForHotel(selectedHotel.id);
      }
    } catch (e) {
      alert('Failed to delete room');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="bng-container">
        {/* Header with Multi-Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0ea5e9', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <Building2 size={16} /> Hotel Manager Portal
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
              Property & Revenue Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsCreateHotelOpen(true)}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff' }}
            >
              <Plus size={16} />
              <span>Register New Property</span>
            </button>

            {selectedHotel && (
              <>
                <button
                  onClick={() => setIsEditHotelOpen(true)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff' }}
                >
                  <Image size={16} />
                  <span>Manage Hotel & Photos</span>
                </button>

                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} />
                  <span>Add Room Type</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4 Metric KPI Cards in INR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</span>
              <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.5rem', borderRadius: '10px' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.totalBookings ?? bookings.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
              {stats?.todayBookings ?? 0} check-ins today
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Gross Revenue</span>
              <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '0.5rem', borderRadius: '10px' }}>
                <IndianRupee size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatINR(stats?.totalRevenue ?? 0)}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
              Direct payouts processed (INR)
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Occupancy Rate</span>
              <div style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9', padding: '0.5rem', borderRadius: '10px' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.occupancyRate !== undefined ? `${stats.occupancyRate.toFixed(1)}%` : '0%'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 600 }}>
              Property room occupancy
            </span>
          </div>

          <div className="bng-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Guest Rating</span>
              <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.5rem', borderRadius: '10px' }}>
                <Star size={18} fill="#d97706" />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.averageRating !== undefined && stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} / 10` : '0.0 / 10'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Verified guest feedback
            </span>
          </div>
        </div>

        {/* 2-Column: Managed Properties & Active Room Inventory */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Left Property Picker */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Managed Hotels</h3>
              <button
                onClick={() => setIsCreateHotelOpen(true)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hotels.map((h) => {
                const isSelected = selectedHotel?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => handleSelectHotel(h)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                      border: isSelected ? '2px solid #4f46e5' : '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={h.primaryImageUrl}
                      alt={h.name}
                      style={{ width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {h.city} • from {formatINR(h.startingPrice)}/nt
                      </span>
                      <span style={{ fontSize: '0.7rem', color: h.status === 'APPROVED' ? '#059669' : '#d97706', fontWeight: 600 }}>
                        ● {h.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Room Types Manager & Calendar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Dynamic Rooms List for Selected Property */}
            {selectedHotel ? (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      Room Categories for <span style={{ color: 'var(--primary)' }}>{selectedHotel.name}</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                      Add, modify photo galleries, or adjust base rates in INR.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddRoomOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Plus size={15} /> Add Room Category
                  </button>
                </div>

                {hotelRooms.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {hotelRooms.map((room) => {
                      const isCalendarActive = selectedRoom?.id === room.id;
                      return (
                        <div
                          key={room.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '140px 1fr auto',
                            gap: '1rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: isCalendarActive ? '2px solid #4f46e5' : '1px solid var(--border)',
                            backgroundColor: isCalendarActive ? '#faf5ff' : '#ffffff',
                            alignItems: 'center'
                          }}
                        >
                          {/* Room Thumbnail & Gallery Indicator */}
                          <div style={{ position: 'relative', height: '90px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img
                              src={room.primaryImageUrl}
                              alt={room.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {room.images && room.images.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                color: 'white',
                                fontSize: '0.65rem',
                                padding: '0.15rem 0.35rem',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}>
                                {room.images.length} Photos
                              </div>
                            )}
                          </div>

                          {/* Room Specs & Details */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                {room.name}
                              </h4>
                              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                                {room.roomType}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.4rem 0' }}>
                              {room.description || `${room.bedType} • ${room.mealPlan}`}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span>🛏️ {room.bedType}</span>
                              <span>👥 Max {room.maxAdults} Adults, {room.maxChildren} Child</span>
                              {room.roomSizeSqft && <span>📐 {room.roomSizeSqft} sq.ft</span>}
                              <span>🍴 {room.mealPlan}</span>
                            </div>
                          </div>

                          {/* Pricing & Control Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                                {formatINR(room.basePrice)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / night</span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => setSelectedRoom(room)}
                                className={isCalendarActive ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                              >
                                {isCalendarActive ? 'Calendar Active' : 'Rates Calendar'}
                              </button>

                              <button
                                onClick={() => setEditingRoom(room)}
                                className="btn btn-outline btn-sm"
                                title="Edit room details & photos"
                                style={{ padding: '0.35rem 0.5rem' }}
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteRoom(room.id, room.name)}
                                className="btn btn-outline btn-sm"
                                title="Delete room"
                                style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                    <Bed size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem 0' }}>No Room Categories Added Yet</h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Add your first room type (Deluxe, Suite, Villa) with photos and INR night rates to receive guest bookings.
                    </p>
                    <button
                      onClick={() => setIsAddRoomOpen(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} /> Add Room Category
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Inventory Calendar */}
            {selectedRoom ? (
              <InventoryCalendar
                room={selectedRoom}
                onUpdated={() => selectedHotel && loadRoomsForHotel(selectedHotel.id)}
              />
            ) : (
              <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Select a property and room type to configure dynamic pricing & availability calendar</p>
              </div>
            )}
          </div>
        </div>

        {/* Guest Reservations Tracker Table in INR */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Guest Reservations</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Incoming customer bookings for your properties</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Reference</th>
                  <th style={{ padding: '0.75rem' }}>Guest Name</th>
                  <th style={{ padding: '0.75rem' }}>Room</th>
                  <th style={{ padding: '0.75rem' }}>Check-in</th>
                  <th style={{ padding: '0.75rem' }}>Nights</th>
                  <th style={{ padding: '0.75rem' }}>Amount (INR)</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>{b.bookingReference}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.guestName}</td>
                      <td style={{ padding: '0.75rem' }}>{b.roomName}</td>
                      <td style={{ padding: '0.75rem' }}>{b.checkInDate}</td>
                      <td style={{ padding: '0.75rem' }}>{b.totalNights}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{formatINR(b.totalAmount)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={b.bookingStatus === 'CANCELLED' ? 'badge badge-coral' : 'badge badge-emerald'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No incoming guest reservations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateHotelModal
        isOpen={isCreateHotelOpen}
        onClose={() => setIsCreateHotelOpen(false)}
        onHotelCreated={() => loadData()}
      />

      {selectedHotel && (
        <EditHotelModal
          hotel={selectedHotel}
          isOpen={isEditHotelOpen}
          onClose={() => setIsEditHotelOpen(false)}
          onHotelUpdated={() => loadData(selectedHotel.id)}
        />
      )}

      {selectedHotel && (
        <AddRoomModal
          hotelId={selectedHotel.id}
          isOpen={isAddRoomOpen}
          onClose={() => setIsAddRoomOpen(false)}
          onRoomAdded={() => loadRoomsForHotel(selectedHotel.id)}
        />
      )}

      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          isOpen={!!editingRoom}
          onClose={() => setEditingRoom(null)}
          onRoomUpdated={() => selectedHotel && loadRoomsForHotel(selectedHotel.id)}
        />
      )}
    </div>
  );
};
