import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Booking, Service, ServiceProvider, Address } from '../types';
import { serviceCategories, serviceProviders } from '../data/services';
import { supabase } from '../lib/supabase';

interface BookingCardProps {
  booking: Booking;
  address: Address | undefined;
  onCancel: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, address, onCancel }) => {
  const [service, setService] = useState<Service | undefined>();
  const [provider, setProvider] = useState<ServiceProvider | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServiceAndProvider = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch service from Supabase
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', booking.serviceId)
          .single();
          
        if (serviceError) {
          console.error('Error loading service from Supabase:', serviceError);
          // Fall back to local data
          const localService = serviceCategories
            .flatMap(category => category.services)
            .find(service => service.id === booking.serviceId);
            
          setService(localService);
        } else if (serviceData) {
          setService({
            id: serviceData.id,
            name: serviceData.name,
            category: serviceData.category,
            price: serviceData.price,
            rating: serviceData.rating || 0,
            image: serviceData.image || 'https://via.placeholder.com/150',
            description: serviceData.description || '',
            duration: serviceData.duration,
            providerId: serviceData.provider_id
          });
        }
        
        // Try to fetch provider from Supabase
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('*, profiles(*)')
          .eq('id', booking.providerId)
          .single();
          
        if (providerError) {
          console.error('Error loading provider from Supabase:', providerError);
          // Fall back to local data
          const localProvider = serviceProviders
            .find(provider => provider.id === booking.providerId);
            
          setProvider(localProvider);
        } else if (providerData) {
          setProvider({
            id: providerData.id,
            name: providerData.profiles?.full_name || 'Service Provider',
            image: providerData.profiles?.avatar_url || 'https://via.placeholder.com/150',
            rating: providerData.rating || 4.5,
            totalBookings: providerData.total_bookings || 0,
            services: []
          });
        }
      } catch (error) {
        console.error('Error loading service and provider data:', error);
        setError('Failed to load booking details');
        
        // Fall back to local data as a last resort
        const localService = serviceCategories
          .flatMap(category => category.services)
          .find(service => service.id === booking.serviceId);
          
        const localProvider = serviceProviders
          .find(provider => provider.id === booking.providerId);
          
        setService(localService);
        setProvider(localProvider);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServiceAndProvider();
  }, [booking.serviceId, booking.providerId]);

  // If still loading or no service/provider found, show placeholder
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // If error or missing data, show error card
  if (error || (!service && !provider)) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span className="font-medium">Error loading booking details</span>
        </div>
        <p className="text-gray-600 mb-2">Booking ID: {booking.id}</p>
        <p className="text-gray-600 mb-2">Date: {booking.date}</p>
        <p className="text-gray-600">Time: {booking.time}</p>
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button 
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{service?.name || 'Service'}</h3>
            <p className="text-sm text-gray-500">{service?.category || 'Category'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {provider && (
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img 
                src={provider.image} 
                alt={provider.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, use a placeholder
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Provider';
                }}
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{provider.name}</p>
              <p className="text-sm text-gray-500">Service Provider</p>
            </div>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>{booking.time}</span>
          </div>
          {address && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
              <span>{address.address}, {address.city}, {address.pincode}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <p className="font-bold text-gray-800">₹{booking.price}</p>
          
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button 
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;