import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, X, Calendar as CalendarIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface Booking {
  id: string;
  service: string;
  customer: {
    name: string;
    phone: string;
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  amount: number;
}

const BookingsPage: React.FC = () => {
  const { profile } = useAuthStore();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Mock data - In a real app, this would come from your backend
  const bookings: Booking[] = [
    {
      id: '1',
      service: 'Emergency Tire Repair',
      customer: {
        name: 'Rahul Sharma',
        phone: '9876543210',
      },
      date: '2025-03-15',
      time: '10:00 AM',
      status: 'pending',
      address: '123 Main St, Sector 14, Mumbai',
      amount: 1200
    },
    {
      id: '2',
      service: 'Regular AC Service',
      customer: {
        name: 'Priya Patel',
        phone: '9876543211',
      },
      date: '2025-03-16',
      time: '2:00 PM',
      status: 'confirmed',
      address: '456 Park Avenue, Andheri West, Mumbai',
      amount: 1500
    },
    {
      id: '3',
      service: 'Home Cleaning',
      customer: {
        name: 'Amit Verma',
        phone: '9876543212',
      },
      date: '2025-02-10',
      time: '11:00 AM',
      status: 'completed',
      address: '789 Green Road, Bandra, Mumbai',
      amount: 2000
    },
    {
      id: '4',
      service: 'Laptop Repair',
      customer: {
        name: 'Neha Khan',
        phone: '9876543213',
      },
      date: '2025-02-05',
      time: '4:00 PM',
      status: 'cancelled',
      address: '321 Tech Plaza, Powai, Mumbai',
      amount: 1800
    }
  ];

  const upcomingBookings = bookings.filter(booking => 
    ['pending', 'confirmed'].includes(booking.status)
  );
  
  const pastBookings = bookings.filter(booking => 
    ['completed', 'cancelled'].includes(booking.status)
  );

  const displayBookings = tab === 'upcoming' ? upcomingBookings : pastBookings;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all your service bookings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Set Availability
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setTab('upcoming')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                tab === 'upcoming'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Bookings
            </button>
            <button
              onClick={() => setTab('past')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                tab === 'past'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Bookings
            </button>
          </nav>
        </div>

        {displayBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {tab === 'upcoming' ? "You don't have any upcoming bookings" : "You don't have any past bookings"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Schedule
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                      <div className="text-sm text-gray-500">{booking.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md transition-colors">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Accept
                          </button>
                          <button className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition-colors">
                            <X className="h-4 w-4 inline mr-1" />
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-md transition-colors">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Complete
                        </button>
                      )}
                      
                      {booking.status === 'completed' && (
                        <button className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-md transition-colors">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage; 