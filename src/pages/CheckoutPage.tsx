import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Plus, Phone, Edit, ChevronRight, AlertCircle, CheckCircle, Loader, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { useBookings } from '../context/BookingContext';
import AddressForm from '../components/AddressForm';
import { Address } from '../types';
import { supabase } from '../lib/supabase';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { user: supabaseUser, profile } = useAuthStore();
  const { addBooking } = useBookings();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [selectedTip, setSelectedTip] = useState<string>('');
  const [customTip, setCustomTip] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // Generate available time slots
  const availableTimeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM'
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setPageLoading(true);
        // Check Supabase session
        const { data: session } = await supabase.auth.getSession();
        const hasSupabaseAuth = !!session?.session?.user;
        
        // If neither authentication method is available, redirect to login
        if (!isAuthenticated && !hasSupabaseAuth) {
          navigate('/login', { state: { from: '/checkout' } });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // If there's an error checking Supabase auth, fall back to context auth
        if (!isAuthenticated) {
          navigate('/login', { state: { from: '/checkout' } });
        }
      } finally {
        setPageLoading(false); // Ensure pageLoading is always set to false
      }
    };
    
    checkAuth();
  }, [isAuthenticated, supabaseUser, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setAddressesLoading(true);
        
        // First, try sessionStorage for the latest address (most reliable fallback)
        const latestAddressJson = sessionStorage.getItem('latestAddress');
        if (latestAddressJson) {
          try {
            const latestAddress = JSON.parse(latestAddressJson);
            const exists = addresses.some(addr => addr.id === latestAddress.id);
            if (!exists) {
              const updatedAddresses = [...addresses, latestAddress];
              setAddresses(updatedAddresses);
              setSelectedAddress(latestAddress.id);
            } else {
              setSelectedAddress(latestAddress.id);
            }
            
            console.log('Address loaded from sessionStorage');
          } catch (e) {
            console.log('Error parsing latest address from sessionStorage', e);
          }
        }
        
        // Next, try regular localStorage
        try {
          const storedAddresses = localStorage.getItem('userAddresses');
          if (storedAddresses) {
            const parsedAddresses = JSON.parse(storedAddresses);
            if (parsedAddresses && parsedAddresses.length > 0) {
              // Only replace addresses if we found more in localStorage than we currently have
              if (!addresses.length || addresses.length < parsedAddresses.length) {
                setAddresses(parsedAddresses);
                if (!selectedAddress) {
                  setSelectedAddress(parsedAddresses[0].id);
                }
                console.log('Addresses loaded from localStorage');
              }
            }
          }
        } catch (e) {
          console.log('Error loading addresses from localStorage', e);
        }
        
        // Check for user context addresses
        if (user?.addresses && user.addresses.length > 0) {
          if (!addresses.length || addresses.length < user.addresses.length) {
            setAddresses(user.addresses);
            if (!selectedAddress && user.addresses.length > 0) {
              setSelectedAddress(user.addresses[0].id);
            }
            console.log('Addresses loaded from user context');
          }
        }
        
        // Finally try Supabase as a last option (since we know it's failing)
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          try {
            const { data, error } = await supabase
              .from('addresses')
              .select('*')
              .eq('user_id', session.session.user.id);
              
            if (error) {
              console.log('Error loading addresses from Supabase:', error.message);
            } else if (data && data.length > 0) {
              const mappedAddresses = data.map(addr => ({
                id: addr.id,
                type: addr.type || 'Home',
                address: addr.address,
                city: addr.city,
                pincode: addr.pincode
              }));
              setAddresses(mappedAddresses);
              
              if (!selectedAddress) {
                setSelectedAddress(mappedAddresses[0].id);
              }
              console.log('Addresses loaded from Supabase');
            }
          } catch (supabaseError) {
            console.log('Error in Supabase request:', supabaseError);
          }
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      } finally {
        setAddressesLoading(false);
      }
    };
    
    loadAddresses();
  }, [user, selectedAddress, addresses.length]);

  // Auto-select the first date and time slot if none is selected
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
    
    if (!selectedTime && availableTimeSlots.length > 0) {
      setSelectedTime(availableTimeSlots[0]);
    }
  }, [selectedDate, selectedTime, availableDates, availableTimeSlots]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!selectedTime) {
      newErrors.time = 'Please select a time slot';
    }
    
    if (!selectedAddress) {
      newErrors.address = 'Please select an address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressAdded = async () => {
    setShowAddressForm(false);
    setAddressesLoading(true);
    
    try {
      // First try to get the latest address from sessionStorage
      const latestAddressJson = sessionStorage.getItem('latestAddress');
      if (latestAddressJson) {
        try {
          const latestAddress = JSON.parse(latestAddressJson);
          
          // Add to existing addresses if not already there
          const exists = addresses.some(addr => addr.id === latestAddress.id);
          if (!exists) {
            const updatedAddresses = [...addresses, latestAddress];
            setAddresses(updatedAddresses);
            setSelectedAddress(latestAddress.id);
          } else {
            // If it already exists, make sure it's selected
            setSelectedAddress(latestAddress.id);
          }
          
          // We found the address in sessionStorage, so we're done
          setAddressesLoading(false);
          return;
        } catch (parseError) {
          console.log('Error parsing latest address from sessionStorage');
        }
      }
      
      // Try to load from Supabase if the sessionStorage approach failed
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        try {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', session.session.user.id);
            
          if (!error && data) {
            const mappedAddresses = data.map(addr => ({
              id: addr.id,
              type: addr.type || 'Home',
              address: addr.address,
              city: addr.city,
              pincode: addr.pincode
            }));
            setAddresses(mappedAddresses);
            
            // Auto-select the newly added address (should be the last one)
            if (mappedAddresses.length > 0) {
              setSelectedAddress(mappedAddresses[mappedAddresses.length - 1].id);
            }
          }
        } catch (supabaseError) {
          console.log('Supabase error loading addresses, checking local storage');
        }
      }
      
      // If we made it here, check if user context has addresses
      if (user?.addresses) {
        setAddresses(user.addresses);
        
        // Auto-select the newly added address (should be the last one)
        if (user.addresses.length > 0) {
          setSelectedAddress(user.addresses[user.addresses.length - 1].id);
        }
      }
      
      // Finally, check direct localStorage as a last resort
      try {
        const storedAddresses = localStorage.getItem('userAddresses');
        if (storedAddresses) {
          const parsedAddresses = JSON.parse(storedAddresses);
          if (parsedAddresses.length > 0 && (!addresses.length || addresses.length < parsedAddresses.length)) {
            setAddresses(parsedAddresses);
            setSelectedAddress(parsedAddresses[parsedAddresses.length - 1].id);
          }
        }
      } catch (localStorageError) {
        console.log('Error loading addresses from localStorage');
      }
    } catch (error) {
      console.log('Error in handleAddressAdded:', error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get the coordinates
            const { latitude, longitude } = position.coords;
            
            // Here you would typically use a geocoding service to convert coordinates to address
            // For demo purposes, we'll just show a success message
            setTimeout(() => {
              setIsDetectingLocation(false);
              alert(`Location detected at: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nIn a production app, this would be converted to an address using a geocoding service.`);
            }, 2000);
          } catch (error) {
            setIsDetectingLocation(false);
            console.error("Error getting address from coordinates:", error);
            alert("Could not determine your address from location. Please enter it manually.");
          }
        },
        (error) => {
          setIsDetectingLocation(false);
          console.error("Geolocation error:", error);
          alert("Could not access your location. Please ensure location services are enabled or enter your address manually.");
        }
      );
    } else {
      setIsDetectingLocation(false);
      alert("Geolocation is not supported by your browser. Please enter your address manually.");
    }
  };

  const handleTipSelection = (amount: string) => {
    setSelectedTip(amount);
    if (amount === 'custom') {
      setTipAmount(parseInt(customTip) || 0);
    } else {
      setTipAmount(parseInt(amount) || 0);
    }
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomTip(value);
    if (selectedTip === 'custom') {
      setTipAmount(parseInt(value) || 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      return;
    }
    
    if (!user && !supabaseUser) {
      setErrors({ general: 'You must be logged in to place an order' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the current user ID (either from Supabase or local storage)
      const userId = supabaseUser?.id || user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Create a booking for each item in the cart
      for (const item of items) {
        const booking = {
          userId: userId,
          serviceId: item.service.id,
          providerId: item.service.providerId || '1', // Use providerId from service if available, otherwise default
          date: selectedDate,
          time: selectedTime,
          status: 'confirmed' as const,
          addressId: selectedAddress,
          price: item.service.price * item.quantity,
          tipAmount: tipAmount,
          paymentMethod: paymentMethod
        };
        
        // Try to create booking in Supabase if available
        try {
          const { data: session } = await supabase.auth.getSession();
          
          if (session?.session?.user) {
            const { error } = await supabase
              .from('bookings')
              .insert({
                user_id: session.session.user.id,
                service_id: item.service.id,
                provider_id: item.service.providerId || '1',
                booking_date: selectedDate,
                booking_time: selectedTime,
                status: 'confirmed',
                address_id: selectedAddress,
                price: item.service.price * item.quantity,
                tip_amount: tipAmount,
                payment_method: paymentMethod
              });
              
            if (error) {
              console.error('Error creating booking in Supabase:', error);
              // Fall back to local storage if Supabase fails
              addBooking(booking);
            }
          } else {
            // Fall back to local storage if no Supabase session
            addBooking(booking);
          }
        } catch (error) {
          console.error('Error with Supabase booking:', error);
          // Fall back to local storage
          addBooking(booking);
        }
      }
      
      // Clear the cart
      clearCart();
      
      // Redirect to bookings page with success message
      navigate('/bookings', { state: { success: true } });
    } catch (error) {
      console.error('Error creating bookings:', error);
      setErrors({ general: 'Failed to create bookings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-blue-600 mr-2" />
        <span className="text-xl text-gray-700">Loading checkout...</span>
      </div>
    );
  }

  // Get selected address details
  const selectedAddressObj = addresses.find(addr => addr.id === selectedAddress);

  // Calculate price details
  const subtotal = getTotalPrice();
  const serviceFee = 49;
  const taxes = Math.round(subtotal * 0.09); // 9% tax
  const totalAmount = subtotal + serviceFee + taxes + tipAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {errors.general && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 flex items-center">
                <Phone size={18} className="mr-2" />
                Send booking details to
              </h2>
            </div>
            <div className="p-4">
              <p className="text-gray-700">
                {user?.phone || profile?.phone || '+91 XXXXXXXXXX'}
              </p>
            </div>
          </div>
          
          {/* Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 flex items-center">
                <MapPin size={18} className="mr-2" />
                Address
              </h2>
            </div>
            
            <div className="p-4">
              {showAddressForm ? (
                <AddressForm onAddressAdded={handleAddressAdded} />
              ) : (
                <>
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">You don't have any saved addresses.</p>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={detectLocation}
                          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center"
                          disabled={isDetectingLocation}
                        >
                          {isDetectingLocation ? (
                            <>
                              <Loader size={16} className="animate-spin mr-2" />
                              Detecting...
                            </>
                          ) : (
                            <>
                              <MapPin size={16} className="mr-2" />
                              Use Current Location
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add New Address
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {selectedAddressObj ? `${selectedAddressObj.type} - ${selectedAddressObj.address}` : 'No address selected'}
                          </p>
                          {selectedAddressObj && (
                            <p className="text-gray-600 text-sm">
                              {selectedAddressObj.city}, {selectedAddressObj.pincode}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                      </div>
                      
                      {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Time Slot */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 flex items-center">
                <Clock size={18} className="mr-2" />
                Slot
              </h2>
            </div>
            
            {!selectedDate || !selectedTime ? (
              <div className="p-4">
                <button
                  onClick={() => {
                    // This would typically open a date/time picker modal
                    if (!selectedDate) setSelectedDate(availableDates[0]);
                    if (!selectedTime) setSelectedTime(availableTimeSlots[0]);
                  }}
                  className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex justify-center items-center"
                >
                  Select time & date
                </button>
                
                {(errors.date || errors.time) && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.date || errors.time}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">{selectedTime}</p>
                  </div>
                  <button
                    onClick={() => {
                      // This would typically open a date/time picker modal
                      setSelectedDate('');
                      setSelectedTime('');
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                  >
                    <Edit size={14} className="mr-1" />
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800">Payment Method</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Pay Online</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Cancellation Policy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4">
              <h2 className="font-medium text-gray-800 mb-2">Cancellation policy</h2>
              <p className="text-sm text-gray-600">
                Free cancellations if done more than 3 hrs before the service or if a professional isn't assigned.
                A fee will be charged otherwise.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Read full policy</button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Item total</p>
                <p className="text-gray-800 font-medium">₹{subtotal}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-gray-600">Visitation Fee</p>
                <p className="text-gray-800 font-medium">₹{serviceFee}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-gray-600">Taxes and Fee</p>
                <p className="text-gray-800 font-medium">₹{taxes}</p>
              </div>
              
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Tip Amount</p>
                  <p className="text-gray-800 font-medium">₹{tipAmount}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <p className="text-lg font-semibold text-gray-800">Total amount</p>
                <p className="text-lg font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <p className="text-lg font-semibold text-gray-800">Amount to pay</p>
                <p className="text-lg font-bold text-gray-900">₹{totalAmount}</p>
              </div>
            </div>
            
            {/* Tip Section */}
            <div className="mt-6">
              <h3 className="text-gray-700 font-medium mb-3">Add a tip to thank the Professional</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  className={`py-2 px-3 rounded-md border ${selectedTip === '50' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handleTipSelection('50')}
                >
                  ₹50
                </button>
                <button
                  className={`py-2 px-3 rounded-md border ${selectedTip === '75' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} relative`}
                  onClick={() => handleTipSelection('75')}
                >
                  ₹75
                  {selectedTip === '75' && (
                    <span className="absolute -bottom-1 left-0 right-0 text-xs text-green-600">POPULAR</span>
                  )}
                </button>
                <button
                  className={`py-2 px-3 rounded-md border ${selectedTip === '100' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handleTipSelection('100')}
                >
                  ₹100
                </button>
              </div>
              
              <div className={`flex items-center space-x-2 mb-6 ${selectedTip === 'custom' ? 'opacity-100' : 'opacity-70'}`}>
                <button
                  className={`py-2 px-3 rounded-md border ${selectedTip === 'custom' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handleTipSelection('custom')}
                >
                  Custom
                </button>
                {selectedTip === 'custom' && (
                  <div className="flex items-center">
                    <span className="mr-2">₹</span>
                    <input
                      type="text"
                      value={customTip}
                      onChange={handleCustomTipChange}
                      className="border border-gray-300 rounded-md p-2 w-20 text-center"
                      placeholder="Amount"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || addresses.length === 0 || !selectedDate || !selectedTime}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="inline animate-spin mr-2" />
                    Processing...
                  </>
                ) : addresses.length === 0 ? 
                  'Add an address to continue' : 
                  !selectedDate || !selectedTime ? 
                  'Select date and time to continue' : 
                  `Pay ₹${totalAmount}`}
              </button>
              
              <div className="mt-4 text-right">
                <button className="text-sm text-blue-600 hover:text-blue-800">View breakup</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;