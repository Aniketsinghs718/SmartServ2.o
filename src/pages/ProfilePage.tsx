import React, { useState, useEffect } from 'react';
import { User as UserIcon, MapPin, Mail, Phone, Loader, AlertCircle, Edit, Trash, Calendar, Settings, CreditCard, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import AddressForm from '../components/AddressForm';
import { supabase } from '../lib/supabase';
import { Address } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { user: supabaseUser, profile } = useAuthStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
                pincode: addr.pincode,
                latitude: addr.latitude,
                longitude: addr.longitude
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

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    setActionLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // Try to delete from Supabase first
        try {
          const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', addressId)
            .eq('user_id', session.session.user.id);
            
          if (error) {
            console.error('Error deleting address from Supabase:', error);
            // Continue to local fallback
          }
        } catch (e) {
          console.error('Exception during Supabase delete:', e);
          // Continue to local fallback
        }
      }
      
      // Update local state
      setAddresses(prevAddresses => 
        prevAddresses.filter(addr => addr.id !== addressId)
      );
      
      // Also remove from localStorage
      try {
        const storedAddresses = localStorage.getItem('userAddresses');
        if (storedAddresses) {
          const parsedAddresses = JSON.parse(storedAddresses);
          const updatedAddresses = parsedAddresses.filter((addr: Address) => addr.id !== addressId);
          localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        }
      } catch (e) {
        console.error('Error updating localStorage after address deletion:', e);
      }
      
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddressAdded = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    // Reload the page to fetch updated addresses
    window.location.reload();
  };

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
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header section with background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-8">
          <div className="flex items-center">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mr-6 shadow-md">
              <UserIcon size={48} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{displayName}</h1>
              <p className="text-blue-100 capitalize">{displayRole}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'addresses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      
      {error && (
          <div className="m-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex border-b border-gray-200 pb-4">
                  <div className="w-1/3 text-gray-600">Full Name</div>
                  <div className="w-2/3 font-medium text-gray-800">{displayName}</div>
            </div>
            
                <div className="flex border-b border-gray-200 pb-4">
                  <div className="w-1/3 text-gray-600">Email</div>
                  <div className="w-2/3 font-medium text-gray-800">{displayEmail}</div>
              </div>
              
                <div className="flex border-b border-gray-200 pb-4">
                  <div className="w-1/3 text-gray-600">Phone</div>
                  <div className="w-2/3 font-medium text-gray-800">{displayPhone || 'Not provided'}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/3 text-gray-600">Account Type</div>
                  <div className="w-2/3 font-medium text-gray-800 capitalize">{displayRole}</div>
            </div>
          </div>
        </div>
          )}
        
          {activeTab === 'addresses' && (
            <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
                
                {!showAddressForm && (
              <button
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                  >
                    Add New Address
              </button>
                )}
            </div>
            
            {showAddressForm && (
              <div className="mb-8 border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <AddressForm 
                    onAddressAdded={handleAddressAdded} 
                    editingAddress={editingAddress}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                  setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
              </div>
            )}
            
            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">You don't have any saved addresses.</p>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Your First Address
                    </button>
                  )}
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(address => (
                    <div key={address.id} className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">{address.type}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-gray-500 hover:text-blue-600"
                              title="Edit address"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation(address.id)}
                              className="text-gray-500 hover:text-red-600"
                              title="Delete address"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-800 font-medium mb-1">{address.address}</p>
                        <p className="text-gray-600">{address.city}, {address.pincode}</p>
                        
                        {address.latitude && address.longitude && (
                          <div className="mt-2 text-xs text-gray-500">
                            Coordinates: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                          </div>
                        )}
                        
                        {/* Confirmation Dialog */}
                        {deleteConfirmation === address.id && (
                          <div className="mt-4 p-3 border border-red-100 bg-red-50 rounded-md">
                            <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this address?</p>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800"
                                disabled={actionLoading}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                disabled={actionLoading}
                              >
                                {actionLoading ? (
                                  <>
                                    <Loader size={12} className="inline animate-spin mr-1" />
                                    Deleting...
                                  </>
                                ) : 'Delete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Security Settings</h3>
                        <p className="text-sm text-gray-500">Manage your password and security preferences</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Payment Methods</h3>
                        <p className="text-sm text-gray-500">Manage your payment methods and preferences</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Settings className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Preferences</h3>
                        <p className="text-sm text-gray-500">Customize your experience and notifications</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <LogOut className="h-6 w-6 text-red-400 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-red-600">Log Out</h3>
                        <p className="text-sm text-gray-500">Sign out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;