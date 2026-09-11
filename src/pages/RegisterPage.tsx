import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, UserCheck, Lock, Mail, Phone, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'HOTEL_OWNER'>('CUSTOMER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role
      });
      if (role === 'HOTEL_OWNER') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '3.5rem 0 6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="bng-container" style={{ maxWidth: '500px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Join BookNowGo</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Create an account to book stays or manage your property</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {/* Account Type Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: role === 'CUSTOMER' ? '2px solid #4f46e5' : '1px solid var(--border)',
                backgroundColor: role === 'CUSTOMER' ? '#eef2ff' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: role === 'CUSTOMER' ? '#4f46e5' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Customer Account
            </button>

            <button
              type="button"
              onClick={() => setRole('HOTEL_OWNER')}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: role === 'HOTEL_OWNER' ? '2px solid #0ea5e9' : '1px solid var(--border)',
                backgroundColor: role === 'HOTEL_OWNER' ? '#f0f9ff' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: role === 'HOTEL_OWNER' ? '#0ea5e9' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Hotel Owner / Host
            </button>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                placeholder="+1 (555) 000-0000"
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Password (min 6 chars) *</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontWeight: 800 }}
            >
              {submitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
