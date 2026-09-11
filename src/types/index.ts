export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface Location {
  id: number;
  country: string;
  state?: string;
  city: string;
  area?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  cityImage?: string;
  isPopular: boolean;
}

export interface DestinationWithCount {
  id: number;
  city: string;
  state?: string;
  country: string;
  cityImage?: string;
  hotelCount: number;
  startingPrice: number;
}

export interface Hotel {
  currency?: string;
  id: number;
  name: string;
  slug: string;
  description?: string;
  starRating?: number;
  averageRating: number;
  reviewCount: number;
  address: string;
  city: string;
  state?: string;
  country: string;
  area?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  primaryImageUrl: string;
  images: string[];
  amenities: string[];
  startingPrice: number;
  originalPrice: number;
  discountPercentage: number;
  freeCancellation: boolean;
  cancellationPolicy?: string;
  status: string;
  isFeatured?: boolean;
  featured?: boolean;
}

export interface Room {
  currency?: string;
  id: number;
  hotelId: number;
  name: string;
  roomType: string;
  description?: string;
  basePrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  roomSizeSqft?: number;
  mealPlan: string;
  cancellationPolicy: string;
  totalQuantity: number;
  availableQuantity?: number;
  primaryImageUrl: string;
  images: string[];
  amenities: string[];
  isActive?: boolean;
  active?: boolean;
}

export interface Review {
  id: number;
  hotelId: number;
  hotelName?: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  bookingId?: number;
  overallRating: number;
  cleanlinessRating?: number;
  locationRating?: number;
  serviceRating?: number;
  facilitiesRating?: number;
  valueRating?: number;
  headline?: string;
  comment?: string;
  status?: string;
  createdAt: string;
}

export interface HotelDetail extends Hotel {
  postalCode?: string;
  checkInTime: string;
  checkOutTime: string;
  rooms: Room[];
  reviews: Review[];
}

export interface FareBreakdown {
  currency?: string;
  basePricePerNight: number;
  numberOfNights: number;
  numberOfRooms: number;
  totalRoomBasePrice: number;
  discountAmount: number;
  couponCode?: string;
  couponDiscount: number;
  taxableAmount: number;
  taxPercentage: number;
  taxAmount: number;
  serviceFeePercentage: number;
  serviceFee: number;
  finalTotalAmount: number;
}

export interface BookingRequest {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: number;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  couponCode?: string;
  paymentMethod: string;
}

export interface BookingResponse {
  currency?: string;
  id: number;
  bookingReference: string;
  hotelId: number;
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
  hotelImage: string;
  checkInTime: string;
  checkOutTime: string;
  roomId: number;
  roomName: string;
  roomType: string;
  bedType: string;
  mealPlan: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  numberOfRooms: number;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  fareBreakdown: FareBreakdown;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionReference: string;
  cancellationPolicy: string;
  createdAt: string;
}

export interface RefundResponse {
  refundReference: string;
  bookingReference: string;
  originalAmount: number;
  refundAmount: number;
  cancellationFee: number;
  refundStatus: string;
  reason: string;
  processedAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface CouponValidation {
  valid: boolean;
  code?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  calculatedDiscount?: number;
  message: string;
}

export interface OwnerStats {
  totalBookings: number;
  todayBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  cancellationCount: number;
  averageRating: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentBookings: BookingResponse[];
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalOwners: number;
  totalHotels: number;
  pendingHotelApprovals: number;
  totalBookings: number;
  totalGrossBookingsAmount: number;
  totalPlatformCommission: number;
  bookingTrends: { month: string; bookings: number }[];
  topDestinations: { city: string; share: number }[];
  pendingHotels: Hotel[];
}

export interface HotelSearchFilters {
  query?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  minRating?: number;
  amenities?: string[];
  freeCancellation?: boolean;
  sortBy?: string;
}
