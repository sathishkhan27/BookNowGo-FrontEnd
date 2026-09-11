import React, { useState } from 'react';
import { reviewApi } from '../../api/client';
import { X, Star, Send } from 'lucide-react';

interface ReviewModalProps {
  hotelId: number;
  hotelName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  hotelId,
  hotelName,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const [overallRating, setOverallRating] = useState(9.0);
  const [cleanliness, setCleanliness] = useState(9.0);
  const [locationScore, setLocationScore] = useState(9.0);
  const [serviceScore, setServiceScore] = useState(9.0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your stay.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await reviewApi.addReview(hotelId, {
        overallRating,
        cleanlinessRating: cleanliness,
        locationRating: locationScore,
        serviceRating: serviceScore,
        facilitiesRating: overallRating,
        valueRating: overallRating,
        headline: headline.trim() || 'Wonderful stay',
        comment: comment.trim()
      });
      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Write a Verified Review</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hotelName}</p>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Overall Rating Score */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Overall Rating: {overallRating} / 10
            </label>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={overallRating}
              onChange={(e) => setOverallRating(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#4f46e5' }}
            />
          </div>

          {/* Sub-ratings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleanliness ({cleanliness})</span>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={cleanliness}
                onChange={(e) => setCleanliness(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location ({locationScore})</span>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={locationScore}
                onChange={(e) => setLocationScore(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0ea5e9' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service ({serviceScore})</span>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={serviceScore}
                onChange={(e) => setServiceScore(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Magnificent ocean views and exceptional service!"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Your Detailed Feedback
            </label>
            <textarea
              rows={4}
              placeholder="Share what you loved about the rooms, food, staff, or location..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
