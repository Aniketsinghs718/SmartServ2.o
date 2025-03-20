import { ServiceCategory, ServiceProvider } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Automobile & Roadside Assistance',
    image: 'https://images.pexels.com/photos/17429096/pexels-photo-17429096/free-photo-of-man-fixing-a-car.jpeg?auto=compress&cs=tinysrgb&w=300&auto=format&fit=crop&w=1000&q=80',
    services: [
      {
        id: '101',
        name: 'Emergency Tire Puncture Repair',
        category: 'Automobile & Roadside Assistance',
        price: 499,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'On-the-spot tire puncture repair for bikes & cars with professional tools and quick service'
      },
      {
        id: '102',
        name: 'Battery Jump Start Service',
        category: 'Automobile & Roadside Assistance',
        price: 599,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1517490232338-06b912a786b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Quick battery jumpstart service for all vehicle types'
      },
      {
        id: '103',
        name: 'Emergency Fuel Delivery',
        category: 'Automobile & Roadside Assistance',
        price: 799,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Rapid fuel delivery service when you run out of gas'
      }
    ]
  },
  {
    id: '2',
    name: 'Home Repair & Maintenance',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    services: [
      {
        id: '201',
        name: 'Professional Plumbing Service',
        category: 'Home Repair & Maintenance',
        price: 799,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Expert plumbing repairs and maintenance services'
      },
      {
        id: '202',
        name: 'Electrical Wiring & Repairs',
        category: 'Home Repair & Maintenance',
        price: 699,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional electrical repair and installation services'
      },
      {
        id: '203',
        name: 'Roof Leakage Repair',
        category: 'Home Repair & Maintenance',
        price: 1499,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/9431615/pexels-photo-9431615.jpeg?auto=compress&cs=tinysrgb&w=300&auto=format&fit=crop&w=1000&q=80',
        description: 'Expert roof leak detection and repair services'
      }
    ]
  },
  {
    id: '3',
    name: 'Tech & Gadgets Repair',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    services: [
      {
        id: '301',
        name: 'Laptop Repair Service',
        category: 'Tech & Gadgets Repair',
        price: 999,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional laptop repair and maintenance service'
      },
      {
        id: '302',
        name: 'CCTV Installation',
        category: 'Tech & Gadgets Repair',
        price: 2499,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Complete CCTV system installation and setup'
      },
      {
        id: '303',
        name: 'Smart Lock Installation',
        category: 'Tech & Gadgets Repair',
        price: 1999,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1523484489927-4aa8bf9a99d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFydCUyMExvY2slMjBJbnN0YWxsYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Smart lock installation and configuration service'
      }
    ]
  },
  {
    id: '4',
    name: 'Industrial & Commercial',
    image: 'https://images.unsplash.com/photo-1592963219573-c388f7232a5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SW5kdXN0cmlhbCUyMCUyNiUyMENvbW1lcmNpYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80',
    services: [
      {
        id: '401',
        name: 'Welding Service',
        category: 'Industrial & Commercial',
        price: 1499,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional welding and metal fabrication service'
      },
      {
        id: '402',
        name: 'AC Duct Cleaning',
        category: 'Industrial & Commercial',
        price: 3999,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1631545805520-4ef44d9a2c48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Complete AC duct cleaning and sanitization'
      },
      {
        id: '403',
        name: 'Fire Safety Maintenance',
        category: 'Industrial & Commercial',
        price: 2499,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Fire safety equipment inspection and maintenance'
      }
    ]
  }
];

export const serviceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    totalBookings: 324,
    services: ['101', '102', '103']
  },
  {
    id: '2',
    name: 'Amit Singh',
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    totalBookings: 256,
    services: ['201', '202', '203']
  },
  {
    id: '3',
    name: 'Suresh Patel',
    image: 'https://images.unsplash.com/photo-1597346908500-28cda8acfe4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    totalBookings: 198,
    services: ['301', '302', '303']
  },
  {
    id: '4',
    name: 'Vikram Mehta',
    image: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
    totalBookings: 287,
    services: ['401', '402', '403']
  }
];