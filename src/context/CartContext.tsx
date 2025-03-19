import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service } from '../types';

interface CartItem {
  service: Service;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        } else {
          console.error('Invalid cart format in localStorage, resetting cart');
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = (service: Service) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);
      
      if (existingItem) {
        // Increment quantity if item already exists
        return prevItems.map(item => 
          item.service.id === service.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { service, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === serviceId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity if more than 1
        return prevItems.map(item => 
          item.service.id === serviceId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        // Remove item completely if quantity is 1
        return prevItems.filter(item => item.service.id !== serviceId);
      }
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.service.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getTotalPrice, 
      getTotalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};