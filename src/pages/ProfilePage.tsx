import React, { useState, useEffect } from 'react';
import { User as UserIcon, MapPin, Mail, Phone, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import AddressForm from '../components/AddressForm';
import { supabase } from '../lib/supabase';
import { Address } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { user: supabaseUser, profile } = useAuthStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      
      try {
        const { data: session } = await supabase.auth.getSession();
        
        // First check if we have local addresses from AuthContext
        if (user?.addresses && user.addresses.length > 0) {
          setAddresses(user.addresses);
          setIsLoading(false);
          return;
        }
        
        // Only try Supabase if we're logged in
        if (session?.session?.user) {
          try {
            const { data, error } = await supabase
              .from('addresses')
              .select('*')
              .eq('user_id', session.session.user.id);
              
            if (error) {
              // Handle quietly - we'll fall back to local storage
              console.log('Using local storage fallback for addresses');
              
              // Check sessionStorage for the latest added address
              const latestAddressJson = sessionStorage.getItem('latestAddress');
              if (latestAddressJson) {
                try {
                  const latestAddress = JSON.parse(latestAddressJson);
                  if (!user?.addresses?.some(addr => addr.id === latestAddress.id)) {
                    // If we have a recent address in sessionStorage, use it
                    setAddresses([latestAddress]);
                  }
                } catch (e) {
                  console.log('Error parsing latest address from sessionStorage');
                }
              }
              
              // Also check regular local storage directly
              try {
                const storedAddresses = localStorage.getItem('userAddresses');
                if (storedAddresses) {
                  setAddresses(JSON.parse(storedAddresses));
                }
              } catch (e) {
                console.log('Error loading addresses from localStorage');
              }
            } else if (data && data.length > 0) {
              const mappedAddresses = data.map(addr => ({
                id: addr.id,
                type: addr.type || 'Home',
                address: addr.address,
                city: addr.city,
                pincode: addr.pincode
              }));
              setAddresses(mappedAddresses);
            }
          } catch (supabaseError) {
            // Database error (likely table doesn't exist)
            // Fall back to local storage
            if (user?.addresses) {
              setAddresses(user.addresses);
            }
          }
        } else if (user?.addresses) {
          // No Supabase session, but we have local addresses
          setAddresses(user.addresses);
        }
      } catch (error) {
        // Only set error state for critical errors
        if (!user?.addresses || user.addresses.length === 0) {
          setError('Failed to load addresses. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user]);

  // Determine which user data to display (Supabase or local)
  const displayName = profile?.full_name || user?.name || 'User';
  const displayEmail = supabaseUser?.email || user?.email || '';
  const displayPhone = profile?.phone || user?.phone || '';
  const displayRole = profile?.role || 'customer';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Loader size={32} className="animate-spin text-blue-600 mr-2" />
        <span className="text-xl text-gray-700">Loading profile...</span>
      </div>
    );
  }

  if (!user && !supabaseUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-gray-600">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <UserIcon size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{displayName}</h2>
                <p className="text-gray-600 capitalize">{displayRole}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700">{displayEmail}</span>
              </div>
              
              {displayPhone && (
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{displayPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Addresses */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>
            
            {showAddressForm && (
              <div className="mb-8 border-b border-gray-200 pb-6">
                <AddressForm onAddressAdded={() => {
                  setShowAddressForm(false);
                  // Reload addresses after adding a new one
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }} />
              </div>
            )}
            
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">You don't have any saved addresses.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{address.type}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{address.address}</p>
                    <p className="text-gray-600">{address.city}, {address.pincode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;