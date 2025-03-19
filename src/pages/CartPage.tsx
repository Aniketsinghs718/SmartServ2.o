import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link 
          to="/services" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Continue Shopping
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any services to your cart yet.</p>
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items ({getTotalItems()})
                </h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.service.id} className="p-6">
                    <div className="flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.service.image}
                          alt={item.service.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.service.name}
                          </h3>
                          <p className="text-lg font-medium text-gray-900">
                            ₹{item.service.price}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.service.category}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-2">Qty: {item.quantity}</span>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-800 font-medium">₹{getTotalPrice()}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Service Fee</p>
                  <p className="text-gray-800 font-medium">₹49</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-lg font-semibold text-gray-800">Total</p>
                  <p className="text-lg font-bold text-gray-900">₹{getTotalPrice() + 49}</p>
                </div>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;