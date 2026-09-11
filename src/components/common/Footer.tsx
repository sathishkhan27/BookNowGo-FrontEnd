import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, Award, Headphones, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="bng-container">
        {/* Value Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '10px', color: '#38bdf8' }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Best Price Guarantee</h4>
              <p style={{ fontSize: '0.825rem' }}>Direct comparisons ensure you never overpay for your hotel room.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Verified Hotels</h4>
              <p style={{ fontSize: '0.825rem' }}>Strict quality reviews and verified customer guest ratings.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '10px', color: '#818cf8' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.825rem' }}>256-bit encrypted transactions, cards, UPI & zero cancellation fees.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '10px', color: '#f43f5e' }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.825rem' }}>Our hospitality concierge is always a call or chat message away.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          padding: '3rem 0',
          borderBottom: '1px solid #1e293b'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                BookNow<span style={{ color: '#0ea5e9' }}>Go</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              The next-generation hotel booking and price discovery platform. Transparent stays, instant confirmations, and verified luxury resorts worldwide.
            </p>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Top Destinations</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/search?query=Goa" style={{ color: '#94a3b8' }}>Hotels in Goa</Link></li>
              <li><Link to="/search?query=Mumbai" style={{ color: '#94a3b8' }}>Luxury Stays in Mumbai</Link></li>
              <li><Link to="/search?query=Paris" style={{ color: '#94a3b8' }}>Boutique Hotels Paris</Link></li>
              <li><Link to="/search?query=Dubai" style={{ color: '#94a3b8' }}>Skyline Suites Dubai</Link></li>
              <li><Link to="/search?query=New+Delhi" style={{ color: '#94a3b8' }}>Regent Hotels New Delhi</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Property Owners</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/owner" style={{ color: '#94a3b8' }}>List Your Property</Link></li>
              <li><Link to="/owner" style={{ color: '#94a3b8' }}>Owner Dashboard</Link></li>
              <li><Link to="/owner" style={{ color: '#94a3b8' }}>Inventory & Rate Calendar</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8' }}>Hotel Partner Program</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Admin & Legal</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/admin" style={{ color: '#94a3b8' }}>Admin Console</Link></li>
              <li><span style={{ color: '#94a3b8' }}>Privacy Policy</span></li>
              <li><span style={{ color: '#94a3b8' }}>Terms of Service</span></li>
              <li><span style={{ color: '#94a3b8' }}>Refund & Cancellation Rules</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            © {new Date().getFullYear()} BookNowGo Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Currency: USD ($)</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
