import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, PenTool as Tool, ShoppingCart } from 'lucide-react';
import { Service } from '../types';
import { useCart } from '../context/CartContext';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(service);
  };

  return (
    <Link to={`/service/${service.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-800">{service.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center mb-2">
            <Tool size={16} className="text-blue-600 mr-2" />
            <p className="text-sm font-medium text-blue-600">{service.category}</p>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {service.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">₹{service.price}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>60 min</span>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;