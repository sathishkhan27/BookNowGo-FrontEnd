import React, { useState } from 'react';
import { adminApi } from '../../api/client';
import { X, Tag, Plus } from 'lucide-react';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCouponCreated: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onCouponCreated }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(20);
  const [minAmount, setMinAmount] = useState(100);
  const [maxDiscount, setMaxDiscount] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSubmitting(true);
    try {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 60);

      await adminApi.createCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue,
        minBookingAmount: minAmount,
        maxDiscountAmount: maxDiscount,
        validFrom: now.toISOString(),
        validTo: nextMonth.toISOString(),
        usageLimit: 500,
        timesUsed: 0,
        isActive: true
      });

      onCouponCreated();
      onClose();
    } catch (e) {
      alert('Failed to create coupon voucher');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create Promotional Coupon</h3>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Coupon Code (Uppercase) *
            </label>
            <input
              type="text"
              placeholder="e.g. FLASH30, HOLIDAYDEAL"
              value={code}
              required
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{ width: '100%', fontWeight: 700, letterSpacing: '0.05em' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Offer Description
            </label>
            <input
              type="text"
              placeholder="e.g. 20% off all boutique suite bookings"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Discount Type
              </label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} style={{ width: '100%' }}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Discount Value *
              </label>
              <input
                type="number"
                min="1"
                value={discountValue}
                required
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 10)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Min Booking Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minAmount}
                onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Plus size={16} />
              <span>{submitting ? 'Creating...' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
