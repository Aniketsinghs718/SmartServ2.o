import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, profile, isProvider, signOut, isLoading } = useAuthStore();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isProviderDashboard = location.pathname.startsWith('/provider');

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled || isProviderDashboard 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={`text-2xl font-bold ${isScrolled || isProviderDashboard ? 'text-indigo-600' : 'text-white'}`}>
                UrbanServices
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isProviderDashboard ? (
              <>
                <Link 
                  to="/services" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                  }`}
                >
                  Services
                </Link>
                <Link 
                  to="/about" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                  }`}
                >
                  Contact
                </Link>
                
                <Link 
                  to="/cart" 
                  className={`relative px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/provider/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/provider/services" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  My Services
                </Link>
                <Link 
                  to="/provider/bookings" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Bookings
                </Link>
                <Link 
                  to="/provider/earnings" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Earnings
                </Link>
              </>
            )}
            
            {!isLoading && (user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled || isProviderDashboard 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white hover:text-indigo-200'
                  }`}
                >
                  <User size={20} className="mr-1" />
                  <span>{profile.full_name.split(' ')[0]}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <MapPin size={16} className="inline mr-2" />
                      My Bookings
                    </Link>
                    
                    {isProvider ? (
                      <Link 
                        to="/provider/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Briefcase size={16} className="inline mr-2" />
                        Switch to Provider
                      </Link>
                    ) : (
                      <Link 
                        to="/become-provider" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Briefcase size={16} className="inline mr-2" />
                        Become a Provider
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isProviderDashboard || isScrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-600 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {!isProviderDashboard && (
              <Link 
                to="/cart" 
                className={`relative px-3 py-2 mr-2 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled || isProviderDashboard
                  ? 'text-gray-700 hover:text-indigo-600'
                  : 'text-white hover:text-indigo-200'
              } focus:outline-none`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isProviderDashboard ? (
              <>
                <Link 
                  to="/services" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/provider/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/provider/services" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Services
                </Link>
                <Link 
                  to="/provider/bookings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bookings
                </Link>
                <Link 
                  to="/provider/earnings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Earnings
                </Link>
              </>
            )}
            
            {user && profile ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="inline mr-2" />
                  Profile
                </Link>
                <Link 
                  to="/bookings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin size={16} className="inline mr-2" />
                  My Bookings
                </Link>
                
                {isProvider ? (
                  <Link 
                    to="/provider/dashboard" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Briefcase size={16} className="inline mr-2" />
                    Switch to Provider
                  </Link>
                ) : (
                  <Link 
                    to="/become-provider" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Briefcase size={16} className="inline mr-2" />
                    Become a Provider
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;