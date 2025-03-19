import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ServiceCategory } from '../types';

interface CategoryCardProps {
  category: ServiceCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`} className="block group">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent z-10" />
        
        <div className="h-72 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-2xl font-bold text-white mb-2">
            {category.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/90">
              {category.services.length} services
            </p>
            
            <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-medium mr-2">Explore</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;