import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful login
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: email,
      phone: '9876543210',
      addresses: [
        {
          id: '1',
          type: 'Home',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          pincode: '400001'
        }
      ]
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful registration
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      phone: phone,
      addresses: []
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString()
      };
      
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress]
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, addAddress }}>
      {children}
    </AuthContext.Provider>
  );
};