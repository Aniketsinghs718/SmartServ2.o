import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { Booking, Address } from '../types';

const BookingsPage: React.FC = () => {
  const location = useLocation();
  const { user: authUser } = useAuth(); // Renamed to avoid unused variable warning
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Demo addresses
  const demoAddresses: Address[] = [
    {
      id: 'demo-address-1',
      type: 'Home',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001'
    },
    {
      id: 'demo-address-2',
      type: 'Work',
      address: '456 Office Park, Building C',
      city: 'Delhi',
      pincode: '110001'
    }
  ];
  
  // Demo bookings data
  const demoBookings: Booking[] = [
    {
      id: 'demo-booking-1',
      userId: 'demo-user',
      serviceId: 'ac-service-1',
      providerId: 'provider-1',
      addressId: 'demo-address-1',
      date: '2025-04-25',
      time: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      price: 1299,
      serviceName: 'AC Service & Repair',
      serviceImage: 'https://i.imgur.com/jz3RCYX.png',
      providerName: 'Cool Air Services'
    },
    {
      id: 'demo-booking-2',
      userId: 'demo-user',
      serviceId: 'plumbing-2',
      providerId: 'provider-2',
      addressId: 'demo-address-2',
      date: '2025-04-22',
      time: '02:00 PM - 04:00 PM',
      status: 'confirmed',
      price: 899,
      serviceName: 'Plumbing Repair',
      serviceImage: 'https://i.imgur.com/D3zHUw3.png',
      providerName: 'Quick Fix Plumbers'
    },
    {
      id: 'demo-booking-3',
      userId: 'demo-user',
      serviceId: 'cleaning-3',
      providerId: 'provider-3',
      addressId: 'demo-address-1',
      date: '2025-04-15',
      time: '09:00 AM - 11:00 AM',
      status: 'completed',
      price: 1599,
      serviceName: 'Deep Cleaning Service',
      serviceImage: 'https://i.imgur.com/O5tJ87n.png',
      providerName: 'Sparkle Cleaning Co.'
    },
    {
      id: 'demo-booking-4',
      userId: 'demo-user',
      serviceId: 'electric-4',
      providerId: 'provider-4',
      addressId: 'demo-address-2',
      date: '2025-04-10',
      time: '11:00 AM - 01:00 PM',
      status: 'cancelled',
      price: 699,
      serviceName: 'Electrical Repair',
      serviceImage: 'https://i.imgur.com/kvdeMjD.png',
      providerName: 'Power Electric Solutions'
    }
  ];
  
  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state && location.state.success) {
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  // Simulate loading
  useEffect(() => {
    // Simulate data loading with a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter bookings by status
  const upcomingBookings = demoBookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = demoBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  // Mock cancel booking function
  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      alert('Booking cancelled successfully (demo mode)');
    }
  };
  
  // Find address for each booking
  const getAddressForBooking = (addressId: string) => {
    return demoAddresses.find(address => address.id === addressId);
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
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
          Demo Mode
        </div>
      </div>
      
      <div className="space-y-10">
        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Bookings</h2>
          
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
        </div>
        
        {/* Past Bookings */}
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
      </div>
    </div>
  );
};

export default BookingsPage;