import React, { useEffect, useState } from 'react';
import { loadingManager } from '../../utils/loadingManager';
import { Loader2 } from 'lucide-react';

export const GlobalLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loading, count) => {
      setIsLoading(loading);
      setActiveCount(count);

      if (loading) {
        setVisible(true);
      } else {
        // Small delay before hiding to prevent flickering and ensure smooth transition
        const timer = setTimeout(() => {
          setVisible(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top Edge Glowing Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 999999,
          pointerEvents: 'none',
          overflow: 'hidden',
          backgroundColor: 'rgba(79, 70, 229, 0.15)'
        }}
      >
        <div
          className="global-loader-bar"
          style={{
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, #4f46e5 0%, #0ea5e9 50%, #10b981 100%)',
            boxShadow: '0 0 12px rgba(14, 165, 233, 0.8), 0 0 4px #4f46e5',
            animation: 'globalLoaderSweep 1.5s ease-in-out infinite'
          }}
        />
      </div>

      {/* Floating Status Pill */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 999998,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '9999px',
          color: '#ffffff',
          fontSize: '0.8125rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          opacity: isLoading ? 1 : 0,
          transform: isLoading ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
          transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Loader2
          size={16}
          style={{
            color: '#38bdf8',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span>
          Loading{activeCount > 1 ? ` (${activeCount})` : ''}...
        </span>
      </div>

      <style>{`
        @keyframes globalLoaderSweep {
          0% {
            transform: translateX(-100%) scaleX(0.2);
          }
          50% {
            transform: translateX(0%) scaleX(0.7);
          }
          100% {
            transform: translateX(100%) scaleX(0.2);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};
