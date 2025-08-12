import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Loader, AlertCircle, MapPin } from 'lucide-react';
import { Address } from '../types';

interface AddressFormProps {
  onAddressAdded: () => void;
  editingAddress?: Address | null;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressAdded, editingAddress }) => {
  const { addAddress, user, isAuthenticated } = useAuth();
  const { user: supabaseUser } = useAuthStore();
  
  // Check for temporary detected address from sessionStorage
  const getInitialFormData = () => {
    try {
      const tempDetectedAddressJson = sessionStorage.getItem('tempDetectedAddress');
      if (tempDetectedAddressJson) {
        const tempAddress = JSON.parse(tempDetectedAddressJson);
        // Clear the temp address so it's only used once
        sessionStorage.removeItem('tempDetectedAddress');
        return {
          type: tempAddress.type || 'Home',
          address: tempAddress.address || '',
          city: tempAddress.city || '',
          pincode: tempAddress.pincode || '',
          latitude: tempAddress.latitude,
          longitude: tempAddress.longitude
        };
      }
    } catch (e) {
      console.error('Error parsing tempDetectedAddress:', e);
    }
    
    // Fall back to editing address or default values
    return {
      type: editingAddress?.type || 'Home',
      address: editingAddress?.address || '',
      city: editingAddress?.city || '',
      pincode: editingAddress?.pincode || '',
      latitude: editingAddress?.latitude || undefined as number | undefined,
      longitude: editingAddress?.longitude || undefined as number | undefined
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Check if we have any kind of authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      // If no authentication is available, show an error message
      if (!isAuthenticated && !session?.session?.user) {
        setErrors({ 
          general: 'You must be logged in to add an address. Please log in and try again.' 
        });
      }
    };
    
    checkAuth();
  }, [isAuthenticated]);

  // When editingAddress changes, update the form data
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        type: editingAddress.type || 'Home',
        address: editingAddress.address || '',
        city: editingAddress.city || '',
        pincode: editingAddress.pincode || '',
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude
      });
    }
  }, [editingAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    setErrors({});
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use geocoding API to get address details
            const response = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=67e2852867f22430310666byi5cebbf`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch address from coordinates');
            }
            
            const data = await response.json();
            
            if (data && data.address) {
              // Extract relevant address components
              const street = data.address.road || '';
              const houseNumber = data.address.house_number || '';
              const fullStreet = houseNumber ? `${houseNumber} ${street}` : street;
              const addressLine = data.address.neighbourhood || data.address.suburb || '';
              const city = data.address.city || data.address.town || data.address.state_district || '';
              const pincode = data.address.postcode || '';
              
              // Construct full address
              const fullAddress = fullStreet + (addressLine ? `, ${addressLine}` : '');
              
              // Update form data with address details
              setFormData(prev => ({
                ...prev,
                address: fullAddress || '',
                city: city || '',
                pincode: pincode || '',
                latitude: latitude,
                longitude: longitude
              }));
            } else {
              throw new Error('No address data found');
            }
            
            setIsDetectingLocation(false);
          } catch (error) {
            setIsDetectingLocation(false);
            console.error("Error getting address from coordinates:", error);
            setErrors({ 
              location: 'Could not determine your address from location. Please enter it manually.' 
            });
          }
        },
        (error) => {
          setIsDetectingLocation(false);
          console.error("Geolocation error:", error);
          setErrors({ 
            location: 'Could not access your location. Please ensure location services are enabled.' 
          });
        }
      );
    } else {
      setIsDetectingLocation(false);
      setErrors({ 
        location: 'Geolocation is not supported by your browser. Please enter your address manually.' 
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create a local address as fallback option
  const saveAddressLocally = () => {
    // Create a unique ID for the address
    const newAddressId = `local-${Date.now()}`;
    const newAddress = {
      ...formData,
      id: newAddressId
    };
    
    try {
      // Save to sessionStorage for immediate access (most reliable and consistent)
      sessionStorage.setItem('latestAddress', JSON.stringify(newAddress));
      console.log('Address saved to sessionStorage:', newAddress);
      
      // Save to general localStorage for all addresses (more consistent across sessions)
      try {
        const existingAddresses = localStorage.getItem('userAddresses');
        let addresses = existingAddresses ? JSON.parse(existingAddresses) : [];
        addresses.push(newAddress);
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        console.log('Address saved to localStorage userAddresses');
      } catch (e) {
        console.error('Error saving to localStorage userAddresses:', e);
      }
      
      // If user context is available, use that too
      if (user) {
        try {
          addAddress(formData);
          console.log('Address saved to user context');
        } catch (e) {
          console.error('Error saving to user context:', e);
        }
      }
      
      return {
        success: true,
        address: newAddress
      };
    } catch (error) {
      console.error('Error saving address to local storage:', error);
      // Try the minimum necessary - just session storage
      try {
        sessionStorage.setItem('latestAddress', JSON.stringify(newAddress));
        return {
          success: true,
          address: newAddress
        };
      } catch (e) {
        return {
          success: false,
          error: { message: e instanceof Error ? e.message : 'Unknown error occurred' }
        };
      }
    }
  };

  const handleSuccess = (addressData: any) => {
    // Store the latest address in sessionStorage for immediate access
    sessionStorage.setItem('latestAddress', JSON.stringify(addressData));
    
    // Set success state
    setSuccess(true);
    
    // Reset form
    setFormData({
      type: 'Home',
      address: '',
      city: '',
      pincode: '',
      latitude: undefined,
      longitude: undefined
    });
    
    // Notify parent component
    setTimeout(() => {
      onAddressAdded();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      let addressSaved = false;
      let savedAddressData = null;
      
      // Check if we have any kind of authentication first
      if (!isAuthenticated && !supabaseUser) {
        // Try to save locally without auth as last resort
        const result = saveAddressLocally();
        
        if (!result.success) {
          throw new Error('Could not save address. Please try again later.');
        } else {
          handleSuccess(result.address);
          return;
        }
      }
      
      // Try to add address to Supabase if we have a session
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        try {
          // First, check if the 'addresses' table exists
          const { error: tableCheckError } = await supabase
            .from('addresses')
            .select('id')
            .limit(1)
            .maybeSingle();
          
          // If the table doesn't exist or another error occurs during the check
          if (tableCheckError) {
            console.log('Addresses table check error, using local storage fallback:', tableCheckError);
            
            // Fall back to local storage
            const result = saveAddressLocally();
            
            if (!result.success) {
              throw new Error('Could not save address. Please try again later.');
            } else {
              savedAddressData = result.address;
              handleSuccess(savedAddressData);
            }
          } else {
            // If editing an existing address
            if (editingAddress) {
              // Update the address in Supabase
              const { data, error } = await supabase
                .from('addresses')
                .update({
                  type: formData.type,
                  address: formData.address,
                  city: formData.city,
                  pincode: formData.pincode,
                  latitude: formData.latitude,
                  longitude: formData.longitude
                })
                .eq('id', editingAddress.id)
                .eq('user_id', session.session.user.id)
                .select();
                
              if (error) {
                console.error('Error updating address in Supabase:', error);
                // Try updating in local storage
                try {
                  const storedAddresses = localStorage.getItem('userAddresses');
                  if (storedAddresses) {
                    const addresses = JSON.parse(storedAddresses);
                    const updatedAddresses = addresses.map((addr: Address) => {
                      if (addr.id === editingAddress.id) {
                        return {
                          ...addr,
                          ...formData,
                        };
                      }
                      return addr;
                    });
                    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
                    handleSuccess(formData);
                  }
                } catch (e) {
                  console.error('Error updating address in localStorage:', e);
                  throw new Error('Could not update address. Please try again later.');
                }
              } else {
                // Successfully updated in Supabase
                addressSaved = true;
                savedAddressData = data[0];
                handleSuccess(savedAddressData);
              }
            } else {
              // If table exists, try to insert a new address
            const { data, error } = await supabase
              .from('addresses')
              .insert({
                user_id: session.session.user.id,
                type: formData.type,
                address: formData.address,
                city: formData.city,
                  pincode: formData.pincode,
                  latitude: formData.latitude,
                  longitude: formData.longitude
              })
              .select();
              
            if (error) {
              console.error('Error adding address to Supabase:', error);
              
              // Check if error is related to permissions
              const errorMessage = error.message || '';
              if (errorMessage.includes('row-level security') || errorMessage.includes('permission denied')) {
                setErrors({ 
                  general: 'Permission denied. Please check your account permissions.' 
                });
              }
              
              // Try fallback to local storage for any Supabase error
              const result = saveAddressLocally();
              
              if (!result.success) {
                throw new Error('Could not save address. Please try again later.');
              } else {
                savedAddressData = result.address;
                handleSuccess(savedAddressData);
              }
            } else if (data && data.length > 0) {
              // Successfully added to Supabase
              console.log('Address added to Supabase successfully:', data[0]);
              addressSaved = true;
              savedAddressData = data[0];
              
              // Update local copy to ensure consistency
              if (user) {
                // Also update in local storage for redundancy
                try {
                  const existingAddresses = localStorage.getItem(`user_${user.id}_addresses`);
                  let addresses = existingAddresses ? JSON.parse(existingAddresses) : [];
                  addresses.push(data[0]);
                  localStorage.setItem(`user_${user.id}_addresses`, JSON.stringify(addresses));
                } catch (e) {
                  console.log('Error updating local storage with Supabase address:', e);
                }
              }
              
              handleSuccess(savedAddressData);
              }
            }
          }
        } catch (error: any) {
          console.error('Error with Supabase address creation:', error);
          
          // Fall back to local storage
          const result = saveAddressLocally();
          
          if (!result.success) {
            throw new Error('Could not save address after multiple attempts. Please try again later.');
          } else {
            savedAddressData = result.address;
            handleSuccess(savedAddressData);
          }
        }
      } else {
        // No Supabase session, try local storage
        console.log('No Supabase session, using local storage for address');
        const result = saveAddressLocally();
        
        if (!result.success) {
          throw new Error('Could not save address. Please try again later.');
        } else {
          savedAddressData = result.address;
          handleSuccess(savedAddressData);
        }
      }
    } catch (error: any) {
      console.error('Error adding address:', error);
      setErrors({ 
        general: error.message || 'Failed to add address. Please try again.' 
      });
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
        <p className="font-medium">Address added successfully!</p>
        <p className="mt-2">
          <button 
            onClick={onAddressAdded}
            className="text-green-800 underline hover:text-green-900"
          >
            Use this address
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}
      
      {errors.location && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.location}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <button
          type="button"
          onClick={detectLocation}
          className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center justify-center"
          disabled={isDetectingLocation}
        >
          {isDetectingLocation ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Detecting your location...
            </>
          ) : (
            <>
              <MapPin size={16} className="mr-2" />
              Use Current Location
            </>
          )}
        </button>
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Address Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="House/Flat No., Building, Street"
          className={`mt-1 block w-full rounded-md ${errors.address ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className={`mt-1 block w-full rounded-md ${errors.city ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
      </div>
      
      <div>
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          type="text"
          id="pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="6-digit pincode"
          className={`mt-1 block w-full rounded-md ${errors.pincode ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
        />
        {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              {editingAddress ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            editingAddress ? 'Update Address' : 'Save Address'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;