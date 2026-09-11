import { FareBreakdown } from '../types';

/**
 * Formats a numeric amount as Indian Rupee (INR / ₹)
 * Examples: formatINR(15000) -> "₹15,000", formatINR(15000.5, { showDecimals: true }) -> "₹15,000.50"
 */
export function formatINR(amount?: number | null, options: { showDecimals?: boolean; compact?: boolean } = {}): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const { showDecimals = false, compact = false } = options;

  if (compact && amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);
}

/**
 * Dynamically computes the full fare breakdown in INR
 * Based on base price per night, number of nights, number of rooms, and coupon discounts
 */
export function calculateINRFare(params: {
  basePricePerNight: number;
  checkIn: string;
  checkOut: string;
  roomsCount?: number;
  discountPercentage?: number;
  couponDiscount?: number;
  couponCode?: string;
}): FareBreakdown {
  const {
    basePricePerNight,
    checkIn,
    checkOut,
    roomsCount = 1,
    discountPercentage = 0,
    couponDiscount = 0,
    couponCode
  } = params;

  // Calculate nights safely
  let nights = 1;
  if (checkIn && checkOut) {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    nights = diff > 0 ? diff : 1;
  }

  const totalRoomBasePrice = Math.round(basePricePerNight * nights * roomsCount);
  const promotionalDiscount = Math.round(totalRoomBasePrice * (discountPercentage / 100));
  const effectiveCouponDiscount = Math.min(couponDiscount, Math.max(0, totalRoomBasePrice - promotionalDiscount));

  const taxableAmount = Math.max(0, totalRoomBasePrice - promotionalDiscount - effectiveCouponDiscount);
  
  // 12% GST standard for hotel rooms in India
  const taxPercentage = 12;
  const taxAmount = Math.round(taxableAmount * 0.12);

  // 5% platform / concierge fee
  const serviceFeePercentage = 5;
  const serviceFee = Math.round(taxableAmount * 0.05);

  const finalTotalAmount = taxableAmount + taxAmount + serviceFee;

  return {
    currency: 'INR',
    basePricePerNight,
    numberOfNights: nights,
    numberOfRooms: roomsCount,
    totalRoomBasePrice,
    discountAmount: promotionalDiscount,
    couponCode,
    couponDiscount: effectiveCouponDiscount,
    taxableAmount,
    taxPercentage,
    taxAmount,
    serviceFeePercentage,
    serviceFee,
    finalTotalAmount
  };
}
