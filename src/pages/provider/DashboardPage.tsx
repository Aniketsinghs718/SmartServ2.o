import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Star, Users, Briefcase, ChevronRight, AlertCircle, TrendingUp, PieChart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const DashboardPage: React.FC = () => {
  const { profile, isProvider } = useAuthStore();

  // Mock data - In a real app, this would come from your backend
  const stats = {
    totalBookings: 156,
    completedServices: 142,
    totalEarnings: 45600,
    averageRating: 4.8,
    pendingBookings: 3
  };

  const recentBookings = [
    {
      id: '1',
      service: 'Emergency Tire Repair',
      customer: 'Rahul Sharma',
      date: '2025-03-15',
      time: '10:00 AM',
      status: 'pending'
    },
    {
      id: '2',
      service: 'Regular AC Service',
      customer: 'Priya Patel',
      date: '2025-03-16',
      time: '2:00 PM',
      status: 'confirmed'
    },
    {
      id: '3',
      service: 'Home Cleaning',
      customer: 'Amit Verma',
      date: '2025-03-18',
      time: '11:00 AM',
      status: 'confirmed'
    },
  ];

  if (!isProvider) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need to become a service provider to access this dashboard.
          </p>
          <Link
            to="/become-provider"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Become a Provider
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>

        {/* Verification Alert */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg shadow-md">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-base font-medium text-amber-800">
                Complete Your Profile
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Add more details to your provider profile to increase your visibility and booking opportunities.
                <Link to="/provider/verification" className="ml-2 font-medium text-amber-800 underline">
                  Update Profile
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% increase</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>8% increase</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating} <span className="text-sm text-gray-500 font-normal">/ 5</span></p>
              </div>
            </div>
            <div className="flex mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={star <= Math.floor(stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
            <Link to="/provider/bookings" className="mt-3 text-sm text-indigo-600 flex items-center hover:text-indigo-800">
              <span>View pending</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link 
            to="/provider/services" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Services</h3>
                  <p className="text-sm text-gray-600">Add or update your services</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>

          <Link 
            to="/provider/working-hours" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Set Availability</h3>
                  <p className="text-sm text-gray-600">Manage your working hours</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>

          <Link 
            to="/provider/earnings" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                  <p className="text-sm text-gray-600">Track your revenue</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Latest Requests</h3>
              <Link 
                to="/provider/bookings" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentBookings.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{booking.service}</h4>
                    <p className="text-sm text-gray-500 mt-1">{booking.customer}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{booking.date}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1 text-gray-400" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="mt-4 flex space-x-3">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Accept
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;