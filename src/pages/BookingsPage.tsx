import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { useBookings } from '../context/BookingContext';
import BookingCard from '../components/BookingCard';
import { supabase } from '../lib/supabase';
import { Booking, Address } from '../types';

const BookingsPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { user: supabaseUser } = useAuthStore();
  const { getBookingsByUserId, cancelBooking } = useBookings();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  useEffect(() => {
    // Check if redirected from checkout with success state
    if (location.state && location.state.success) {
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        // Load bookings
        if (session?.session?.user) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id (name, price, duration, category, image),
              provider:provider_id (business_name, description)
            `)
            .eq('user_id', session.session.user.id)
            .order('booking_date', { ascending: false });
            
          if (bookingsError) {
            console.log('Falling back to local bookings'); 
            // We don't have local bookings storage yet, can implement later
          } else if (bookingsData) {
            const mappedBookings = bookingsData.map(booking => ({
              id: booking.id,
              userId: booking.user_id,
              serviceId: booking.service_id,
              providerId: booking.provider_id,
              addressId: booking.address_id,
              date: booking.booking_date,
              time: booking.booking_time,
              status: booking.status,
              price: booking.price,
              serviceName: booking.service?.name || '',
              serviceImage: booking.service?.image || '',
              providerName: booking.provider?.business_name || '',
            }));
            setBookings(mappedBookings);
          }
          
          // Load addresses via multiple sources
          try {
            // First check if we have local addresses from AuthContext
            if (user?.addresses && user.addresses.length > 0) {
              setAddresses(user.addresses);
            } else {
              // Try to load from Supabase
              const { data: addressesData, error: addressesError } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', session.session.user.id);
                
              if (addressesError) {
                // Try session storage
                const latestAddressJson = sessionStorage.getItem('latestAddress');
                if (latestAddressJson) {
                  try {
                    const latestAddress = JSON.parse(latestAddressJson);
                    setAddresses([latestAddress]);
                  } catch (e) {
                    console.log('Error parsing latest address from sessionStorage');
                  }
                }
                
                // Also try localStorage directly
                try {
                  const storedAddresses = localStorage.getItem('userAddresses');
                  if (storedAddresses) {
                    setAddresses(JSON.parse(storedAddresses));
                  }
                } catch (e) {
                  console.log('Error loading addresses from localStorage');
                }
              } else if (addressesData && addressesData.length > 0) {
                const mappedAddresses = addressesData.map(addr => ({
                  id: addr.id,
                  type: addr.type || 'Home',
                  address: addr.address,
                  city: addr.city,
                  pincode: addr.pincode
                }));
                setAddresses(mappedAddresses);
              }
            }
          } catch (addressError) {
            // If Supabase fails, fall back to local storage
            if (user?.addresses) {
              setAddresses(user.addresses);
            }
          }
        }
      } catch (error) {
        console.error('Error loading bookings data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  const handleCancelBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Try to update in Supabase first
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', session.session.user.id);
            
          if (error) {
            console.error('Error cancelling booking in Supabase:', error);
            // Fall back to local storage
            cancelBooking(id);
          } else {
            // Update local state
            setBookings(prev => 
              prev.map(booking => 
                booking.id === id 
                  ? { ...booking, status: 'cancelled' } 
                  : booking
              )
            );
          }
        } else {
          // Fall back to local storage
          cancelBooking(id);
          // Update local state
          setBookings(prev => 
            prev.map(booking => 
              booking.id === id 
                ? { ...booking, status: 'cancelled' } 
                : booking
            )
          );
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        setError('Failed to cancel booking. Please try again.');
      }
    }
  };
  
  // Find address for each booking
  const getAddressForBooking = (addressId: string) => {
    return addresses.find(address => address.id === addressId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Loader size={32} className="animate-spin text-blue-600 mr-2" />
        <span className="text-xl text-gray-700">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showSuccess && (
        <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>Your booking has been confirmed successfully!</span>
        </div>
      )}
      
      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No bookings found</h2>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Bookings</h2>
            
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-600">No upcoming bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    address={getAddressForBooking(booking.addressId)}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Past Bookings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    address={getAddressForBooking(booking.addressId)}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;