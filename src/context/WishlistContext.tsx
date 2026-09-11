import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../api/client';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: number[];
  isWishlisted: (hotelId: number) => boolean;
  toggleWishlist: (hotelId: number) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      wishlistApi.getWishlistIds()
        .then(setWishlistIds)
        .catch(() => setWishlistIds([]));
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  const isWishlisted = (hotelId: number) => wishlistIds.includes(hotelId);

  const toggleWishlist = async (hotelId: number) => {
    try {
      const res = await wishlistApi.toggle(hotelId);
      if (res.saved) {
        setWishlistIds(prev => [...prev, hotelId]);
      } else {
        setWishlistIds(prev => prev.filter(id => id !== hotelId));
      }
    } catch (e) {
      console.error('Wishlist toggle error:', e);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        count: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
