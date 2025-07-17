
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
import { Card, CardContent } from '../../../../components/CardDashboard';
import { Bell, Users, Utensils, LayoutDashboard } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 8, 15, 22, 30, 18],
        backgroundColor: '#3b82f6',
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
        text: 'Weekly Orders Overview',
      },
    },
  };

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Statistic Cards */}
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Total Orders</p>
            <p className="text-xl font-bold">2,345</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Users className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-white">New Users</p>
            <p className="text-xl font-bold">425</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Utensils className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Top Dish</p>
            <p className="text-xl font-bold dark:text-white">Pizza</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <Bell className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Alerts</p>
            <p className="text-xl font-bold">7</p>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
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

export default Dashboard;
