import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Star } from 'lucide-react';
import { serviceCategories } from '../data/services';
import CategoryCard from '../components/CategoryCard';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Get all services from all categories
  const allServices = serviceCategories.flatMap(category => category.services);
  
  // Filter services based on search term and selected category
  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? service.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional services for your home, office, and more. Browse our wide selection of services below.
          </p>
        </div>
        
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
            alt="Services Hero" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Find the Perfect Service</h2>
            
            <div className="w-full max-w-2xl relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="absolute inset-y-0 right-0 px-4 text-indigo-600 flex items-center hover:text-indigo-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                  !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {serviceCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                    selectedCategory === category.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Categories Section */}
        {!searchTerm && !selectedCategory && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
              <a href="#all-services" className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                View all services
                <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {serviceCategories.map((category, index) => (
                <div 
                  key={category.id} 
                  className={`transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Services Section */}
        <div id="all-services">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Services` : 'All Services'}
            </h2>
            {(searchTerm || selectedCategory) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            )}
          </div>
          
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="animate-bounce mx-auto h-16 w-16 text-indigo-400 mb-4">
                <Search className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any services matching your search criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Promotion Banner */}
        <div className="mt-16 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                <span className="block">Ready to get started?</span>
                <span className="block text-indigo-200">Book your first service today.</span>
              </h2>
              <p className="mt-3 max-w-lg text-indigo-100">
                Experience the convenience of professional home services with our 100% satisfaction guarantee.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8 flex lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#all-services"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
                >
                  Explore All Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;