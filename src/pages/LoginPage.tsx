import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Shield, AlertCircle, User, ArrowRight, Building, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(
    roleParam === 'admin' ? 'admin' : 'customer'
  );

  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (roleParam === 'admin') {
      setActiveTab('admin');
    } else if (roleParam === 'customer') {
      setActiveTab('customer');
    }
  }, [roleParam]);

  const handleTabChange = (tab: 'customer' | 'admin') => {
    setActiveTab(tab);
    setError('');
    setSearchParams(tab === 'admin' ? { role: 'admin' } : { role: 'customer' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      const isAdmin = user?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ADMIN');
      const isOwner = user?.roles?.some(r => r === 'ROLE_HOTEL_OWNER' || r === 'HOTEL_OWNER');

      if (activeTab === 'admin') {
        if (!isAdmin && !isOwner) {
          logout();
          setError('Access denied: These credentials belong to a customer account. Please switch to Customer Sign In.');
          return;
        }
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/owner');
        }
      } else {
        // Customer login
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from);
        } else if (isAdmin) {
          navigate('/admin');
        } else if (isOwner) {
          navigate('/owner');
        } else {
          navigate('/my-bookings');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '3.5rem 0 6rem 0', minHeight: '82vh', display: 'flex', alignItems: 'center' }}>
      <div className="bng-container" style={{ maxWidth: '460px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Tab Selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.4rem',
            padding: '0.35rem',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange('customer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'customer' ? '#ffffff' : 'transparent',
                color: activeTab === 'customer' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: activeTab === 'customer' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={16} />
              <span>Customer Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'admin' ? '#0f172a' : 'transparent',
                color: activeTab === 'admin' ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Shield size={16} />
              <span>Admin & Host</span>
            </button>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            {activeTab === 'customer' ? (
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                  color: '#ffffff',
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                  boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
                }}>
                  <User size={28} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Customer Sign In
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  Sign in to manage your hotel reservations, saved wishlist, and member discounts.
                </p>
              </>
            ) : (
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#38bdf8',
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  <Shield size={28} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  Admin & Host Portal
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                  Authorized administrators and hotel property managers only
                </p>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              fontSize: '0.825rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span>{error}</span>
                {error.includes('customer account') && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('customer')}
                    style={{
                      display: 'block',
                      marginTop: '0.4rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      textDecoration: 'underline',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Switch to Customer Sign In now →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem', color: '#334155' }}>
                {activeTab === 'customer' ? 'Email Address' : 'Administrator / Host Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem', color: '#334155' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '0.5rem',
                fontWeight: 800,
                backgroundColor: activeTab === 'customer' ? 'var(--primary)' : '#0f172a',
                borderColor: activeTab === 'customer' ? 'var(--primary)' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {activeTab === 'customer' ? (
                <>
                  <User size={16} />
                  <span>{submitting ? 'Signing in...' : 'Sign In as Customer'}</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Shield size={16} color="#38bdf8" />
                  <span>{submitting ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
                </>
              )}
            </button>
          </form>

          {/* Registration link & footer */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            {activeTab === 'customer' ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Don't have an account yet?{' '}
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Create Customer Account
                </Link>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Want to register as a hotel partner?{' '}
                <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                  Register Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

