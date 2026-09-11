import React, { createContext, useContext, useState } from 'react';
import { Hotel } from '../types';

interface CompareContextType {
  compareHotels: Hotel[];
  addToCompare: (hotel: Hotel) => void;
  removeFromCompare: (hotelId: number) => void;
  clearCompare: () => void;
  isComparing: (hotelId: number) => boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareHotels, setCompareHotels] = useState<Hotel[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = (hotel: Hotel) => {
    if (compareHotels.find(h => h.id === hotel.id)) return;
    if (compareHotels.length >= 3) {
      alert('You can compare up to 3 hotels at a time');
      return;
    }
    setCompareHotels(prev => [...prev, hotel]);
    setIsOpen(true);
  };

  const removeFromCompare = (hotelId: number) => {
    setCompareHotels(prev => prev.filter(h => h.id !== hotelId));
  };

  const clearCompare = () => {
    setCompareHotels([]);
    setIsOpen(false);
  };

  const isComparing = (hotelId: number) => compareHotels.some(h => h.id === hotelId);

  return (
    <CompareContext.Provider
      value={{
        compareHotels,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
