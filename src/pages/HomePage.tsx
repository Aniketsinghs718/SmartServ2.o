import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Shield, Clock, Star, CheckCircle, ChevronDown } from 'lucide-react';
import { serviceCategories } from '../data/services';
import CategoryCard from '../components/CategoryCard';

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521747116042-5a810fda9664')] bg-cover bg-center opacity-20" />
          <svg 
            className="absolute bottom-0 left-0 right-0 text-white"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 relative flex flex-col h-full justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                <span className="block">Quality Home Services</span>
                <span className="block text-indigo-300">At Your Doorstep</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-lg">
                Professional services for your home, delivered with care and expertise. Your satisfaction is our top priority.
              </p>
              
              <div className="relative max-w-md mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xl"
                  placeholder="Search for services..."
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/services" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Explore Services
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-lg text-white bg-transparent hover:bg-white hover:text-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
                >
                  How It Works
                  <ChevronDown size={16} className="ml-2" />
                </a>
              </div>
            </div>
            
            <div className={`md:block transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
              <div className="relative">
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay"></div>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 opacity-20 rounded-3xl transform rotate-3"></div>
                <div className="relative transform hover:-rotate-3 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Home Services" 
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex space-x-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">1000+</div>
                <div className="text-indigo-300">Service Providers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-indigo-300">Cities</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">10k+</div>
                <div className="text-indigo-300">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="block">Discover Our Services</span>
              <span className="block text-indigo-600">Professional Solutions for Your Needs</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our wide range of home services designed to make your life easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {serviceCategories.map((category, index) => (
              <div 
                key={category.id} 
                className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-14">
            <Link 
              to="/services" 
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Services
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="block">How It Works</span>
              <span className="block text-indigo-600">Simple and Efficient Process</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Book a service in three simple steps and let us handle the rest
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="hidden md:block w-full border-t-2 border-indigo-100"></div>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12">
                  <Search className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Choose a Service</h3>
                <p className="text-gray-600 text-center">
                  Browse through our wide range of professional services designed to meet your specific needs.
                </p>
                <div className="flex justify-center mt-6">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12">
                  <Clock className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Book a Time Slot</h3>
                <p className="text-gray-600 text-center">
                  Select your preferred date and time for the service. We value your time and convenience.
                </p>
                <div className="flex justify-center mt-6">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:rotate-12">
                  <Star className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Relax and Enjoy</h3>
                <p className="text-gray-600 text-center">
                  Our professionals will arrive at your doorstep at the scheduled time ready to provide excellent service.
                </p>
                <div className="flex justify-center mt-6">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="block">Why Choose Us</span>
              <span className="block text-indigo-600">Quality Service Guaranteed</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              We are committed to providing exceptional service with customer satisfaction as our top priority
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Professionals</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Background verified</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Skilled & trained experts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Regular performance evaluation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">On-Time Service</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Punctual professionals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Respect for your schedule</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Real-time tracking available</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Satisfaction Guaranteed</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Quality assurance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">Service warranty</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span className="text-gray-600">100% money-back guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="block">What Our Customers Say</span>
              <span className="block text-indigo-600">Testimonials from Happy Clients</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Homeowner",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                quote: "The service was excellent! The technician was professional, knowledgeable, and completed the work efficiently. I'm extremely satisfied with the results."
              },
              {
                name: "Rahul Verma",
                role: "Business Owner",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                quote: "I've been using UrbanServices for my business needs for over a year now. Their consistent quality and reliability make them my go-to service provider."
              },
              {
                name: "Ananya Patel",
                role: "Working Professional",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                quote: "As a busy professional, I appreciate the convenience and quality of UrbanServices. The online booking system is easy to use, and the service providers are always punctual."
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-indigo-200">Book your first service today.</span>
                </h2>
                <p className="mt-4 max-w-lg text-lg text-indigo-100">
                  Experience the convenience of professional home services with our 100% satisfaction guarantee.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to="/services" 
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Book a Service
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add a class to define the animation delay */}
      <style>
        {`
        .animation-delay {
          animation-delay: 2s;
        }
        `}
      </style>
    </div>
  );
};

export default HomePage;