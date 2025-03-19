import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const BecomeProviderPage: React.FC = () => {
  const navigate = useNavigate();
  const { becomeProvider, profile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleBecomeProvider = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await becomeProvider();
      setSuccess(true);
      setTimeout(() => {
        navigate('/provider/dashboard');
      }, 3000);
    } catch (err) {
      setError('Failed to become a service provider. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {success ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Congratulations!</h2>
              <p className="mt-2 text-lg text-gray-600">
                You're now a service provider on our platform!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Redirecting you to your provider dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-indigo-600 px-8 py-12 text-white">
                <h1 className="text-3xl font-extrabold">Become a Service Provider</h1>
                <p className="text-indigo-100 mt-2 text-lg">
                  Join our network of trusted professionals and grow your business
                </p>
              </div>
              
              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Why become a service provider?</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                        <Check className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Expand your customer base</p>
                      <p className="text-gray-600">
                        Reach thousands of potential customers looking for your services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                        <Check className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Flexible working hours</p>
                      <p className="text-gray-600">
                        Set your own schedule and work when it's convenient for you
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                        <Check className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Earn more</p>
                      <p className="text-gray-600">
                        Top providers earn competitive income with our fair commission structure
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{profile?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500 mb-6">
                    By continuing, you agree to our Terms of Service and confirm that you will follow our Community Guidelines.
                  </p>
                  
                  <button
                    onClick={handleBecomeProvider}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? 'Processing...' : 'Become a Service Provider'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeProviderPage; 