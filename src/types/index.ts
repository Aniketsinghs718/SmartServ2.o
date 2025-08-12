export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  duration?: string;
  providerId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  image: string;
  services: Service[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  image: string;
  rating: number;
  totalBookings: number;
  services: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'provider';
  addresses: Address[];
}

export interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  addressId: string;
  price: number;
  // Additional fields for display
  serviceName?: string;
  serviceImage?: string;
  providerName?: string;
  tipAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string | null;
  paymentOrderId?: string | null;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  experienceYears: number;
  qualification: string;
  documentsVerified: boolean;
  availableForWork: boolean;
  services: ProviderService[];
  documents: ProviderDocument[];
  workingHours: WorkingHours[];
}

export interface ProviderService {
  id: string;
  serviceId: string;
  price: number;
  isAvailable: boolean;
}

export interface ProviderDocument {
  id: string;
  type: 'identity' | 'certification' | 'experience';
  name: string;
  url: string;
  verified: boolean;
}

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}