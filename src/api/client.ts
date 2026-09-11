import {
  AuthResponse,
  BookingRequest,
  BookingResponse,
  Coupon,
  CouponValidation,
  DestinationWithCount,
  FareBreakdown,
  Hotel,
  HotelDetail,
  HotelSearchFilters,
  Location,
  OwnerStats,
  AdminStats,
  RefundResponse,
  Review,
  Room,
  User
} from '../types';
import { loadingManager } from '../utils/loadingManager';

const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : 'https://booknowgo-backend.onrender.com';
const BASE_URL = `${API_ORIGIN}/api/v1`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isAuthPublic = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
  const token = !isAuthPublic ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  loadingManager.start();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = json.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return json.data !== undefined ? json.data : json;
  } finally {
    loadingManager.stop();
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload: { email: string; password: string; firstName: string; lastName: string; role?: string; phoneNumber?: string }): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: (): Promise<User> =>
    request<User>('/auth/me')
};

// Hotel API
export const hotelApi = {
  getAll: (): Promise<Hotel[]> =>
    request<Hotel[]>('/hotels'),

  getFeatured: (): Promise<Hotel[]> =>
    request<Hotel[]>('/hotels/featured'),

  getById: (id: number): Promise<HotelDetail> =>
    request<HotelDetail>(`/hotels/${id}`),

  getBySlug: (slug: string): Promise<HotelDetail> =>
    request<HotelDetail>(`/hotels/slug/${slug}`)
};

// Search API
export const searchApi = {
  searchHotels: (filters: HotelSearchFilters): Promise<Hotel[]> => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.checkIn) params.append('checkIn', filters.checkIn);
    if (filters.checkOut) params.append('checkOut', filters.checkOut);
    if (filters.adults) params.append('adults', filters.adults.toString());
    if (filters.children) params.append('children', filters.children.toString());
    if (filters.rooms) params.append('rooms', filters.rooms.toString());
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.starRating) params.append('starRating', filters.starRating.toString());
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.freeCancellation) params.append('freeCancellation', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(a => params.append('amenities', a));
    }

    return request<Hotel[]>(`/search?${params.toString()}`);
  },

  getFarePreview: (roomId: number, checkIn: string, checkOut: string, rooms = 1, couponCode?: string): Promise<FareBreakdown> => {
    const params = new URLSearchParams({
      roomId: roomId.toString(),
      checkIn,
      checkOut,
      rooms: rooms.toString()
    });
    if (couponCode) params.append('couponCode', couponCode);
    return request<FareBreakdown>(`/search/fare-preview?${params.toString()}`);
  }
};

// Booking API
export const bookingApi = {
  createBooking: (payload: BookingRequest): Promise<BookingResponse> =>
    request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMyBookings: (): Promise<BookingResponse[]> =>
    request<BookingResponse[]>('/bookings/my-bookings'),

  getByReference: (ref: string): Promise<BookingResponse> =>
    request<BookingResponse>(`/bookings/${ref}`),

  cancelBooking: (ref: string, reason: string): Promise<RefundResponse> =>
    request<RefundResponse>(`/bookings/${ref}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
};

// Reviews API
export const reviewApi = {
  getByHotel: (hotelId: number): Promise<Review[]> =>
    request<Review[]>(`/reviews/hotel/${hotelId}`),

  addReview: (hotelId: number, payload: Partial<Review>): Promise<Review> =>
    request<Review>(`/reviews/hotel/${hotelId}/add`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

// Wishlist API
export const wishlistApi = {
  getWishlist: (): Promise<Hotel[]> =>
    request<Hotel[]>('/wishlist'),

  getWishlistIds: (): Promise<number[]> =>
    request<number[]>('/wishlist/ids'),

  toggle: (hotelId: number): Promise<{ saved: boolean; hotelId: number }> =>
    request<{ saved: boolean; hotelId: number }>(`/wishlist/toggle/${hotelId}`, {
      method: 'POST'
    })
};

// Coupon API
export const couponApi = {
  getActive: (): Promise<Coupon[]> =>
    request<Coupon[]>('/coupons/active'),

  validate: (code: string, amount: number): Promise<CouponValidation> =>
    request<CouponValidation>(`/coupons/validate/${code}?amount=${amount}`)
};

// Location API
export const locationApi = {
  getPopular: (): Promise<DestinationWithCount[]> =>
    request<DestinationWithCount[]>('/locations/popular'),

  search: (query?: string): Promise<Location[]> =>
    request<Location[]>(`/locations/search${query ? `?query=${encodeURIComponent(query)}` : ''}`)
};

// Hotel Owner API
export const ownerApi = {
  getStats: (): Promise<OwnerStats> =>
    request<OwnerStats>('/owner/stats'),

  getHotels: (): Promise<Hotel[]> =>
    request<Hotel[]>('/owner/hotels'),

    createHotel: (payload: any): Promise<Hotel> =>
    request<Hotel>("/owner/hotels", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getHotelById: (hotelId: number): Promise<HotelDetail> =>
    request<HotelDetail>(`/owner/hotels/${hotelId}`),

  updateHotel: (hotelId: number, payload: any): Promise<HotelDetail> =>
    request<HotelDetail>(`/owner/hotels/${hotelId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  updateHotelImages: (hotelId: number, imageUrls: string[]): Promise<HotelDetail> =>
    request<HotelDetail>(`/owner/hotels/${hotelId}/images`, {
      method: "PUT",
      body: JSON.stringify(imageUrls)
    }),

  getRooms: (hotelId: number): Promise<Room[]> =>
    request<Room[]>(`/owner/hotels/${hotelId}/rooms`),

  getRoomById: (roomId: number): Promise<Room> =>
    request<Room>(`/owner/rooms/${roomId}`),

  createRoom: (hotelId: number, payload: any): Promise<any> =>
    request<any>(`/owner/hotels/${hotelId}/rooms`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateRoom: (roomId: number, payload: any): Promise<Room> =>
    request<Room>(`/owner/rooms/${roomId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  updateRoomImages: (roomId: number, imageUrls: string[]): Promise<Room> =>
    request<Room>(`/owner/rooms/${roomId}/images`, {
      method: "PUT",
      body: JSON.stringify(imageUrls)
    }),

  deleteRoom: (roomId: number): Promise<void> =>
    request<void>(`/owner/rooms/${roomId}`, {
      method: "DELETE"
    }),

  updateInventory: (roomId: number, updates: any[]): Promise<void> =>
    request<void>(`/owner/rooms/${roomId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(updates)
    }),

  getBookings: (): Promise<BookingResponse[]> =>
    request<BookingResponse[]>('/owner/bookings')
};

// Admin API
export const adminApi = {
  getStats: (): Promise<AdminStats> =>
    request<AdminStats>('/admin/stats'),

  updateHotelStatus: (hotelId: number, status: string): Promise<Hotel> =>
    request<Hotel>(`/admin/hotels/${hotelId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  getBookings: (): Promise<BookingResponse[]> =>
    request<BookingResponse[]>('/admin/bookings'),

  getUsers: (): Promise<User[]> =>
    request<User[]>('/admin/users'),

  getCoupons: (): Promise<Coupon[]> =>
    request<Coupon[]>('/admin/coupons'),

  createCoupon: (payload: any): Promise<Coupon> =>
    request<Coupon>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
