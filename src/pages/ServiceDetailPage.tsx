import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShoppingCart, Calendar, Clock, CheckCircle, 
  MapPin, User, DollarSign, Shield, ThumbsUp
} from 'lucide-react';
import { serviceCategories, serviceProviders } from '../data/services';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../stores/authStore';
import ProviderCard from '../components/ProviderCard';
import { ServiceProvider } from '../types';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isLoading } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Find the service from all categories
  const service = serviceCategories
    .flatMap(category => category.services)
    .find(service => service.id === id);
  
  // Find providers who offer this service
  const availableProviders = serviceProviders?.filter(provider => 
    provider.services.includes(id || '')
  ) || [];
  
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(
    availableProviders.length > 0 ? availableProviders[0] : null
  );

  if (!service) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(service);
    // Show a success animation or message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = () => {
    if (!user && !isLoading) {
      navigate('/login', { state: { from: `/service/${id}` } });
      return;
    }
    
    addToCart(service);
    navigate('/checkout');
  };

  // Price formatting
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(service.price);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-indigo-50 to-white">
      {/* Floating Action Button for quick booking */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center transform transition-transform duration-300 z-30 ${isScrolled ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-gray-900 mr-4">{service.name}</h3>
            <p className="text-xl font-bold text-indigo-600">{formattedPrice}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
            >
              <ShoppingCart size={18} className="inline mr-1" />
              Add to Cart
            </button>
            <button
              onClick={handleBookNow}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/services" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Services
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <img 
              src={service.image} 
              alt={service.name} 
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {service.category}
              </span>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={star <= Math.floor(service.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{service.rating} ({Math.floor(Math.random() * 500) + 100} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{service.name}</h1>
            
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{service.description}</p>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-indigo-600">{formattedPrice}</span>
                <span className="ml-2 text-sm text-gray-500">/ service</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Free cancellation 24 hours before scheduled time</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-gray-600">{service.duration || '60-90 min'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-gray-600">At your doorstep</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-medium">Professionals</span>
                </div>
                <p className="text-gray-600">{availableProviders.length} available</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-medium">Payment</span>
                </div>
                <p className="text-gray-600">After service completion</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-indigo-600 rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
              
              <button
                onClick={handleBookNow}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Service Inclusions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">What's Included</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Professional service', 'Standard equipment', 'Quality products', 'Thorough inspection', 'Detailed report', 'Satisfaction guarantee'].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Service Providers Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Service Provider</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProviders.length > 0 ? (
              availableProviders.map(provider => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  onSelect={setSelectedProvider}
                  isSelected={selectedProvider?.id === provider.id}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No service providers available at the moment.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Why Choose Our Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trained Professionals</h3>
              <p className="text-gray-600">
                All our service providers are vetted, background-checked, and professionally trained.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">On-Time Service</h3>
              <p className="text-gray-600">
                We respect your time. Our professionals arrive promptly within the scheduled time slot.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <ThumbsUp className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">
                Not satisfied with the service? We'll do everything possible to make it right.
              </p>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="hidden md:block w-full border-t-2 border-indigo-100"></div>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <ShoppingCart className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Book a Service</h3>
                <p className="text-gray-600 text-center">
                  Select your service, add to cart, and proceed to checkout
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Schedule</h3>
                <p className="text-gray-600 text-center">
                  Choose your preferred date and time for the service
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Relax</h3>
                <p className="text-gray-600 text-center">
                  Our professional will arrive on time to deliver quality service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;