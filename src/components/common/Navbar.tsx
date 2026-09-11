import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { 
  Building, 
  Heart, 
  Layers, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  Sparkles 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isOwner, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { compareHotels, setIsOpen: openCompare } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="bng-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Building size={22} />
          </div>
          <div>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              BookNow<span style={{ color: '#0ea5e9', WebkitTextFillColor: '#0ea5e9' }}>Go</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.925rem' }}>
            <Compass size={17} color="#4f46e5" />
            Explore Hotels
          </Link>
          <Link to="/#destinations" style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Destinations
          </Link>
          <Link to="/#deals" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: '#f43f5e', fontSize: '0.925rem' }}>
            <Sparkles size={16} />
            Special Deals
          </Link>

          {isOwner && (
            <Link to="/owner" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <Building size={15} /> Owner Portal
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <ShieldCheck size={15} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Action Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Compare Button */}
          {compareHotels.length > 0 && (
            <button
              onClick={() => openCompare(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main)'
              }}
            >
              <Layers size={16} color="#4f46e5" />
              <span>Compare</span>
              <span style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem'
              }}>
                {compareHotels.length}
              </span>
            </button>
          )}

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            title="Saved Wishlist"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border)',
              color: wishlistCount > 0 ? '#f43f5e' : 'var(--text-muted)'
            }}
          >
            <Heart size={19} fill={wishlistCount > 0 ? '#f43f5e' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                backgroundColor: '#f43f5e',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.35rem 0.65rem 0.35rem 0.35rem',
                  borderRadius: '30px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#ffffff'
                }}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.fullName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="hide-on-mobile" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {user.firstName}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '220px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border)',
                  padding: '0.5rem 0',
                  zIndex: 100
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Calendar size={16} /> My Bookings
                  </Link>

                  {isOwner && (
                    <Link
                      to="/owner"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)'
                      }}
                    >
                      <Building size={16} /> Owner Dashboard
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)'
                      }}
                    >
                      <ShieldCheck size={16} /> Admin Console
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid var(--border)', margin: '0.25rem 0' }}></div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.875rem',
                      color: '#ef4444',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem'
                }}
              >
                <User size={15} />
                <span>Sign In</span>
              </Link>

              <Link
                to="/register"
                className="hide-on-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#ffffff'
                }}
              >
                <span>Register</span>
              </Link>

              <Link
                to="/login?role=admin"
                title="Admin & Host Portal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  fontWeight: 600
                }}
              >
                <ShieldCheck size={14} color="#0ea5e9" />
                <span className="hide-on-mobile">Admin</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            style={{ display: 'none' }}
            className="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
