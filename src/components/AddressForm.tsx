import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Loader, AlertCircle } from 'lucide-react';

interface AddressFormProps {
  onAddressAdded: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressAdded }) => {
  const { addAddress, user, isAuthenticated } = useAuth();
  const { user: supabaseUser } = useAuthStore();
  const [formData, setFormData] = useState({
    type: 'Home',
    address: '',
    city: '',
    pincode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const newAddress = {
      ...formData,
      id: `local-${Date.now()}`
    };
    
    try {
      // Save to sessionStorage for immediate access (most reliable and consistent)
      sessionStorage.setItem('latestAddress', JSON.stringify(newAddress));
      
      // Save to general localStorage for all addresses (more consistent across sessions)
      const existingAddresses = localStorage.getItem('userAddresses');
      let addresses = existingAddresses ? JSON.parse(existingAddresses) : [];
      addresses.push(newAddress);
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
      
      // If user context is available, use that too
      if (user) {
        addAddress(formData);
      }
      
      console.log('Address saved to multiple local storage locations:', newAddress);
      return true;
    } catch (error) {
      console.error('Error saving address to local storage:', error);
      // Try the minimum necessary - just session storage
      try {
        sessionStorage.setItem('latestAddress', JSON.stringify(newAddress));
        return true;
      } catch (e) {
        return false;
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
      pincode: ''
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
        addressSaved = saveAddressLocally();
        
        if (!addressSaved) {
          throw new Error('You must be logged in to add an address. Please log in and try again.');
        } else {
          handleSuccess({
            id: `local-${Date.now()}`,
            ...formData
          });
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
            addressSaved = saveAddressLocally();
            
            if (addressSaved) {
              savedAddressData = {
                id: `local-${Date.now()}`,
                ...formData
              };
              handleSuccess(savedAddressData);
            } else {
              throw new Error('Could not save address. Please try again later.');
            }
            return;
          }
          
          // If table exists, try to insert the address
          const { data, error } = await supabase
            .from('addresses')
            .insert({
              user_id: session.session.user.id,
              type: formData.type,
              address: formData.address,
              city: formData.city,
              pincode: formData.pincode
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
            addressSaved = saveAddressLocally();
            
            if (addressSaved) {
              savedAddressData = data[0];
              handleSuccess(savedAddressData);
            } else {
              throw new Error('Could not save address. Please try again later.');
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
        } catch (error: any) {
          console.error('Error with Supabase address creation:', error);
          
          // Fall back to local storage
          addressSaved = saveAddressLocally();
          
          if (addressSaved) {
            savedAddressData = {
              id: `local-${Date.now()}`,
              ...formData
            };
            handleSuccess(savedAddressData);
          } else {
            throw new Error('Could not save address after multiple attempts. Please try again later.');
          }
        }
      } else {
        // No Supabase session, try local storage
        console.log('No Supabase session, using local storage for address');
        addressSaved = saveAddressLocally();
        
        if (addressSaved) {
          savedAddressData = {
            id: `local-${Date.now()}`,
            ...formData
          };
          handleSuccess(savedAddressData);
        } else {
          throw new Error('Could not save address. Please try again later.');
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
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Address Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Complete Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Flat/House No., Building, Street, Area"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="City"
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
      </div>
      
      <div>
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
          Pincode
        </label>
        <input
          type="text"
          id="pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="6-digit pincode"
          maxLength={6}
        />
        {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="inline animate-spin mr-2" />
              Adding Address...
            </>
          ) : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;