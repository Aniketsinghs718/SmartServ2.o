import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
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

  useEffect(() => {
    const loadServiceAndProvider = async () => {
      setIsLoading(true);

      try {
        // If booking already has service name and provider name, use those as defaults
        // This ensures we show something even if data fetching fails
        if (booking.serviceName) {
          // Create a properly typed service object
          const baseService: Service = {
            id: booking.serviceId,
            name: booking.serviceName || 'Service', // Ensure name is never undefined
            category: 'Service',
            price: booking.price || 0,
            rating: 4.5,
            image: booking.serviceImage || 'https://via.placeholder.com/150',
            description: '',
            duration: '60 min',
            providerId: booking.providerId
          };
          
          setService(prevService => {
            // If there's a previous service, merge with its values
            if (prevService) {
              return {
                ...baseService,
                category: prevService.category || 'Service',
              };
            }
            return baseService;
          });
        }
        
        if (booking.providerName) {
          // Create a properly typed provider object
          const baseProvider: ServiceProvider = {
            id: booking.providerId,
            name: booking.providerName || 'Service Provider', // Ensure name is never undefined
            image: 'https://via.placeholder.com/150?text=Provider',
            rating: 4.5,
            totalBookings: 0,
            services: []
          };
          
          setProvider(prevProvider => {
            // If there's a previous provider, merge with its values
            if (prevProvider) {
              return {
                ...baseProvider,
                rating: prevProvider.rating || 4.5,
              };
            }
            return baseProvider;
          });
        }

        // Try to fetch service from Supabase
        try {
          const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('*')
            .eq('id', booking.serviceId)
            .single();

          if (serviceError) {
            console.log('Falling back to local service data');
            // Fall back to local data
            const localService = serviceCategories
              .flatMap(category => category.services)
              .find(service => service.id === booking.serviceId);

            if (localService) {
              setService(localService);
            }
          } else if (serviceData) {
            const supabaseService: Service = {
              id: serviceData.id,
              name: serviceData.name || booking.serviceName || 'Service',
              category: serviceData.category || 'Category',
              price: serviceData.price || booking.price || 0,
              rating: serviceData.rating || 4.5,
              image: serviceData.image || booking.serviceImage || 'https://via.placeholder.com/150',
              description: serviceData.description || '',
              duration: serviceData.duration || '60 min',
              providerId: serviceData.provider_id || booking.providerId
            };
            setService(supabaseService);
          }
        } catch (serviceErr) {
          console.log('Error fetching service:', serviceErr);
        }

        // Try to fetch provider from Supabase
        try {
          const { data: providerData, error: providerError } = await supabase
            .from('provider_profiles')
            .select('*, profiles(*)')
            .eq('id', booking.providerId)
            .single();

          if (providerError) {
            console.log('Falling back to local provider data');
            // Fall back to local data
            const localProvider = serviceProviders
              .find(provider => provider.id === booking.providerId);
              
            if (localProvider) {
              setProvider(localProvider);
            }
          } else if (providerData) {
            const supabaseProvider: ServiceProvider = {
              id: providerData.id,
              name: providerData.profiles?.full_name || booking.providerName || 'Service Provider',
              image: providerData.profiles?.avatar_url || 'https://via.placeholder.com/150',
              rating: providerData.rating || 4.5,
              totalBookings: providerData.total_bookings || 0,
              services: []
            };
            setProvider(supabaseProvider);
          }
        } catch (providerErr) {
          console.log('Error fetching provider:', providerErr);
        }
      } catch (error) {
        console.log('Error in loadServiceAndProvider:', error);
        // Don't set error state here, let the component try to render with whatever data it has
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceAndProvider();
  }, [booking]);

  // If still loading, show placeholder
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

  // Instead of showing an error, render with the available booking information
  // This ensures users always see their booking details even if service/provider lookup fails
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
            <h3 className="text-lg font-semibold text-gray-800">
              {booking.serviceName || service?.name || 'Service'}
            </h3>
            <p className="text-sm text-gray-500">{service?.category || 'Category'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Show provider info if available */}
        {(provider || booking.providerName) && (
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img
                src={provider?.image || booking.serviceImage || 'https://via.placeholder.com/150?text=Provider'}
                alt={provider?.name || booking.providerName || 'Provider'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, use a placeholder
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Provider';
                }}
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{provider?.name || booking.providerName || 'Service Provider'}</p>
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