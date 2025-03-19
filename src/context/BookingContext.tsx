import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  getBookingsByUserId: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const addBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString()
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const cancelBooking = (id: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
    );
    
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const getBookingsByUserId = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getBookingsByUserId }}>
      {children}
    </BookingContext.Provider>
  );
};