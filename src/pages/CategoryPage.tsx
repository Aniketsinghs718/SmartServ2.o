import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { serviceCategories } from '../data/services';
import ServiceCard from '../components/ServiceCard';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const category = serviceCategories.find(cat => cat.id === id);
  
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
        <Link 
          to="/services" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link 
          to="/services" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Services
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-gray-600 mt-2">
          Browse our selection of {category.name.toLowerCase()} services
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {category.services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;