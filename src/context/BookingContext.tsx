import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'> | Booking) => Booking;
  cancelBooking: (id: string) => void;
  getBookingsByUserId: (userId: string) => Booking[];
  clearBookings: () => void;
  loadBookings: () => void;
  createTestBooking: () => void;
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

  // Load bookings from localStorage on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Log bookings changes
  useEffect(() => {
    console.log('BookingContext - Current bookings count:', bookings.length);
  }, [bookings.length]);

  const loadBookings = () => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings);
        if (Array.isArray(parsedBookings)) {
          console.log('Loaded bookings from localStorage:', parsedBookings.length);
          
          // Filter out any invalid bookings that might not have required fields
          const validBookings = parsedBookings.filter(booking => 
            booking && booking.id && booking.userId && booking.serviceId && 
            booking.date && booking.time && booking.status
          );
          
          // Sort bookings by date (most recent first)
          validBookings.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
          
          setBookings(validBookings);
          
          // Debug info about loaded bookings
          if (validBookings.length > 0) {
            console.log('First booking:', validBookings[0]);
            const userIds = [...new Set(validBookings.map(b => b.userId))];
            console.log('User IDs in bookings:', userIds);
          }
        }
      } catch (error) {
        console.error('Error parsing bookings from localStorage:', error);
        localStorage.removeItem('bookings');
      }
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id'> | Booking) => {
    console.log('Adding booking to context:', bookingData);
    
    // Check if bookingData already has an ID (it might be from Supabase)
    const newBooking: Booking = 'id' in bookingData 
      ? bookingData as Booking 
      : {
          ...bookingData as Omit<Booking, 'id'>,
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
    
    setBookings(prevBookings => {
      // Check if this booking already exists (prevent duplicates)
      const existingIndex = prevBookings.findIndex(b => b.id === newBooking.id);
      
      let updatedBookings: Booking[];
      if (existingIndex >= 0) {
        // Replace the existing booking
        updatedBookings = [
          ...prevBookings.slice(0, existingIndex),
          newBooking,
          ...prevBookings.slice(existingIndex + 1)
        ];
      } else {
        // Add as a new booking
        updatedBookings = [...prevBookings, newBooking];
      }
      
      // Store in localStorage
      try {
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        console.log('Saved booking to localStorage. Total bookings:', updatedBookings.length);
        
        // Debug info about the updated booking list
        const userIds = [...new Set(updatedBookings.map(b => b.userId))];
        console.log('User IDs in updated bookings:', userIds);
      } catch (error) {
        console.error('Error saving bookings to localStorage:', error);
      }
      
      return updatedBookings;
    });
    
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    const bookingExists = bookings.some(b => b.id === id);
    
    if (!bookingExists) {
      console.warn(`Booking with ID ${id} not found in context.`);
      return;
    }
    
    setBookings(prevBookings => {
      const updatedBookings = prevBookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      );
      
      // Update localStorage
      try {
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        console.log('Updated booking status in localStorage');
      } catch (error) {
        console.error('Error updating booking in localStorage:', error);
      }
      
      return updatedBookings;
    });
  };

  const getBookingsByUserId = (userId: string) => {
    if (!userId) {
      console.warn('No userId provided to getBookingsByUserId');
      return [];
    }
    
    // Make userId comparison case-insensitive to catch potential mismatches
    const normalizedUserId = userId.toLowerCase();
    
    const userBookings = bookings.filter(booking => 
      booking.userId && booking.userId.toLowerCase() === normalizedUserId
    );
    
    console.log(`Found ${userBookings.length} bookings for user ${userId} out of ${bookings.length} total bookings`);
    
    if (userBookings.length === 0 && bookings.length > 0) {
      // Debug information when userId doesn't match any bookings
      console.log('Available userIds in bookings:', 
        [...new Set(bookings.map(b => b.userId))]);
    }
    
    return userBookings;
  };
  
  const clearBookings = () => {
    setBookings([]);
    localStorage.removeItem('bookings');
    console.log('All bookings cleared from context and localStorage');
  };

  const createTestBooking = () => {
    const testBooking = {
      userId: "test-user-123",
      serviceId: "test-service-123",
      providerId: "test-provider-123",
      addressId: "test-address-123",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM - 12:00 PM",
      status: "confirmed" as const,
      price: 1299,
      serviceName: "Test Service",
      serviceImage: "https://example.com/image.jpg",
      providerName: "Test Provider",
      tipAmount: 100,
      paymentMethod: "online",
      paymentStatus: "paid"
    };
    
    console.log('Creating test booking:', testBooking);
    const newBooking = addBooking(testBooking);
    console.log('Test booking created with ID:', newBooking.id);
    loadBookings(); // Reload to verify booking was stored
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getBookingsByUserId, clearBookings, loadBookings, createTestBooking }}>
      {children}
    </BookingContext.Provider>
  );
};