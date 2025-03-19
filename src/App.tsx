import React, { useEffect, ReactNode, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { CartProvider } from './context/CartContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CategoryPage from './pages/CategoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BecomeProviderPage from './pages/BecomeProviderPage';

// Provider Pages
import ProviderDashboard from './pages/provider/DashboardPage';
import ProviderServices from './pages/provider/ServicesPage';
import ProviderVerification from './pages/provider/VerificationPage';
import ProviderWorkingHours from './pages/provider/WorkingHoursPage';
import ProviderEarnings from './pages/provider/EarningsPage';
import ProviderBookings from './pages/provider/BookingsPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: boolean;
  requiredProvider?: boolean;
}

// Protected route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredAuth = true, 
  requiredProvider = false 
}) => {
  const { isLoading, user, isProvider } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState({
    isLoading,
    hasUser: !!user,
    isProvider,
    requiredAuth,
    requiredProvider
  });

  // Update debug info when dependencies change
  useEffect(() => {
    setDebugInfo({
      isLoading,
      hasUser: !!user,
      isProvider,
      requiredAuth,
      requiredProvider
    });
    
    console.log('ProtectedRoute state:', {
      isLoading,
      hasUser: !!user,
      isProvider,
      requiredAuth,
      requiredProvider
    });
  }, [isLoading, user, isProvider, requiredAuth, requiredProvider]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading...</p>
        
        {/* Debug information */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md max-w-md">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requiredAuth && !user) {
    console.log('Redirecting to login: Auth required but no user found');
    return <Navigate to="/login" />;
  }

  // If provider access is required but user is not a provider, redirect
  if (requiredProvider && !isProvider) {
    console.log('Redirecting to become-provider: Provider required but user is not a provider');
    return <Navigate to="/become-provider" />;
  }

  // If authentication should NOT happen but user is logged in (like login page)
  if (!requiredAuth && user) {
    console.log('Redirecting to home: Auth not required but user is logged in');
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Auth callback handler for OAuth flows
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loadProfile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;
        
        // Check if there's an error in the URL
        if (hash && hash.includes('error')) {
          const errorMessage = new URLSearchParams(hash.substring(1)).get('error_description');
          throw new Error(errorMessage || 'Authentication failed');
        }
        
        // Wait for Supabase to process the auth callback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Load the user profile
        try {
          await loadProfile();
        } catch (profileError: any) {
          console.error('Profile loading error:', profileError);
          
          // If it's an RLS error, we can still proceed
          if (profileError.message && profileError.message.includes('row-level security')) {
            console.log('RLS error during profile loading, but continuing...');
            // We'll still navigate to home, as the loadProfile function handles RLS errors
          } else {
            throw profileError;
          }
        }
        
        // Redirect to home page or dashboard after successful sign-in
        setLoading(false);
        navigate('/');
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message || 'Authentication failed. Please try again.');
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [loadProfile, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Authentication Error</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <p className="text-sm text-gray-500 text-center">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Completing sign in...</h2>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { loadProfile } = useAuthStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <BookingProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/service/:id" element={<ServiceDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Auth Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <ProtectedRoute requiredAuth={false}>
                        <LoginPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <ProtectedRoute requiredAuth={false}>
                        <RegisterPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Customer Routes */}
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={<CheckoutPage />} 
                  />
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/become-provider" 
                    element={
                      <ProtectedRoute>
                        <BecomeProviderPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Provider Routes */}
                  <Route 
                    path="/provider/dashboard" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/services" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderServices />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/verification" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderVerification />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/working-hours" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderWorkingHours />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/earnings" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderEarnings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/provider/bookings" 
                    element={
                      <ProtectedRoute requiredProvider>
                        <ProviderBookings />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Auth callback route */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BookingProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;