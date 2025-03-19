import React, { useState } from 'react';
import { Plus, Edit2, ToggleLeft as Toggle, AlertCircle } from 'lucide-react';
import { Service, ProviderService } from '../../types';
import { serviceCategories } from '../../data/services';

const ServicesPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock data - In a real app, this would come from your backend
  const providerServices: ProviderService[] = [
    {
      id: '1',
      serviceId: '101',
      price: 499,
      isAvailable: true
    }
  ];

  const allServices = serviceCategories.flatMap(category => category.services);

  const getServiceDetails = (serviceId: string): Service | undefined => {
    return allServices.find(service => service.id === serviceId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add New Service
        </button>
      </div>

      {/* Info Alert */}
      <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <AlertCircle className="h-6 w-6 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Service Management Tips
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Keep your services up to date and competitively priced. You can temporarily disable services if you're unavailable.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6">
        {providerServices.map(providerService => {
          const serviceDetails = getServiceDetails(providerService.serviceId);
          if (!serviceDetails) return null;

          return (
            <div 
              key={providerService.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="flex">
                <div className="flex-shrink-0 w-48">
                  <img
                    src={serviceDetails.image}
                    alt={serviceDetails.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {serviceDetails.name}
                      </h3>
                      <p className="text-sm text-gray-500">{serviceDetails.category}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {}}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit2 size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {}}
                        className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${
                          providerService.isAvailable
                            ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                            : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        <Toggle size={16} className="mr-1" />
                        {providerService.isAvailable ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">
                    {serviceDetails.description}
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{providerService.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Base price: ₹{serviceDetails.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Response time: 60 min
                        </p>
                        <p className="text-sm text-gray-500">
                          Available 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;