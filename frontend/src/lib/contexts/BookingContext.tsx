'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface BookingContextType {
  sport: string | null;
  center: Center | null;
  facility: Facility | null;
  setSport: (sport: string) => void;
  setCenter: (center: Center) => void;
  setFacility: (facility: Facility) => void;
  reset: () => void;
}

export interface Center {
  id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  horario_apertura?: string;
  horario_cierre?: string;
}

export interface Facility {
  id: string;
  center_id: string;
  nombre: string;
  tipo: string;
  capacidad?: number;
  precio_hora?: number;
  activo?: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sport, setSportState] = useState<string | null>(null);
  const [center, setCenterState] = useState<Center | null>(null);
  const [facility, setFacilityState] = useState<Facility | null>(null);

  const setSport = useCallback((sport: string) => {
    setSportState(sport);
    // Reset center and facility when sport changes
    setCenterState(null);
    setFacilityState(null);
  }, []);

  const setCenter = useCallback((center: Center) => {
    setCenterState(center);
    // Reset facility when center changes
    setFacilityState(null);
  }, []);

  const setFacility = useCallback((facility: Facility) => {
    setFacilityState(facility);
  }, []);

  const reset = useCallback(() => {
    setSportState(null);
    setCenterState(null);
    setFacilityState(null);
  }, []);

  return (
    <BookingContext.Provider value={{ sport, center, facility, setSport, setCenter, setFacility, reset }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

