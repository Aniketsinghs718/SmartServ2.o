import React from 'react';
import { Star } from 'lucide-react';
import { ServiceProvider } from '../types';

interface ProviderCardProps {
  provider: ServiceProvider;
  onSelect: (provider: ServiceProvider) => void;
  isSelected?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect, isSelected = false }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
        isSelected ? 'border-2 border-blue-600 ring-2 ring-blue-200' : 'border border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(provider)}
    >
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img 
            src={provider.image} 
            alt={provider.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm mr-2">
              <Star size={14} className="fill-current text-yellow-500 mr-1" />
              <span>{provider.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{provider.totalBookings}+ bookings</span>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-3 text-sm text-blue-600 font-medium">
          Selected Provider
        </div>
      )}
    </div>
  );
};

export default ProviderCard;