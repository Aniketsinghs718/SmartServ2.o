import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const EarningsPage: React.FC = () => {
  // Mock data - In a real app, this would come from your backend
  const earningsData = [
    { date: '2025-03-01', earnings: 2500 },
    { date: '2025-03-02', earnings: 3200 },
    { date: '2025-03-03', earnings: 2800 },
    { date: '2025-03-04', earnings: 3500 },
    { date: '2025-03-05', earnings: 4200 },
    { date: '2025-03-06', earnings: 3800 },
    { date: '2025-03-07', earnings: 4500 }
  ];

  const stats = {
    totalEarnings: 24500,
    weeklyGrowth: 15,
    completedServices: 42,
    averageRating: 4.8
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Earnings Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Growth</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{stats.weeklyGrowth}%</p>
                <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Per Service</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.round(stats.totalEarnings / stats.completedServices)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Earnings Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Earnings']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {earningsData.map((transaction, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Service #{1000 + index}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ₹{transaction.earnings}
                </p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;