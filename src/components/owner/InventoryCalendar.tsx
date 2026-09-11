import React, { useState } from 'react';
import { Room } from '../../types';
import { ownerApi } from '../../api/client';
import { Calendar as CalendarIcon, Save, CheckCircle2 } from 'lucide-react';

interface InventoryCalendarProps {
  room: Room;
  onUpdated?: () => void;
}

export const InventoryCalendar: React.FC<InventoryCalendarProps> = ({ room, onUpdated }) => {
  const daysCount = 14;
  const today = new Date();

  // Generate 14 days
  const [days, setDays] = useState(
    Array.from({ length: daysCount }).map((_, idx) => {
      const d = new Date(today);
      d.setDate(d.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        availableCount: room.totalQuantity || 5,
        blockedCount: 0,
        priceModifier: 0
      };
    })
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateDay = (index: number, field: string, val: number) => {
    setDays(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const payload = days.map(d => ({
        date: d.date,
        availableCount: d.availableCount,
        blockedCount: d.blockedCount,
        priceModifier: d.priceModifier
      }));

      await ownerApi.updateInventory(room.id, payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onUpdated) onUpdated();
    } catch (e) {
      alert('Failed to save inventory updates');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', padding: '1.25rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} color="#4f46e5" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
            Availability & Rates Calendar: <span style={{ color: 'var(--primary)' }}>{room.name}</span>
          </h4>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {savedSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Calendar Updates'}</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daysCount}, minmax(85px, 1fr))`, gap: '0.5rem', minWidth: '950px' }}>
          {days.map((d, index) => {
            const isWeekend = d.dayName === 'Fri' || d.dayName === 'Sat';
            return (
              <div
                key={d.date}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.4rem',
                  backgroundColor: isWeekend ? '#f0fdf4' : '#f8fafc',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isWeekend ? '#166534' : 'var(--text-muted)' }}>
                  {d.dayName}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {d.dayNum}
                </div>

                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Avail</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={d.availableCount}
                    onChange={(e) => handleUpdateDay(index, 'availableCount', parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.2rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Rate +/- ₹</span>
                  <input
                    type="number"
                    value={d.priceModifier}
                    onChange={(e) => handleUpdateDay(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.2rem', textAlign: 'center', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
