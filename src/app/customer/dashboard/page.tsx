"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Heart,
  Wallet,
  Clock,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CustomerDashboard = () => {
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Spending (₵)',
        data: [35, 50, 20, 40, 70, 90, 60],
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Spending Overview',
      },
    },
  };

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Customer Stats */}
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">My Orders</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Heart className="w-8 h-8 text-pink-500" />
          <div>
            <p className="text-sm text-gray-500">Favorites</p>
            <p className="text-xl font-bold">8</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Wallet className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold">₵ 1,200</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Clock className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Last Order</p>
            <p className="text-xl font-bold">2 days ago</p>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Bar options={barOptions} data={barData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
