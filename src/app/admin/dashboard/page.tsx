'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const userStats = {
    labels: ['Customers', 'Restaurants', 'Orders'],
    datasets: [
      {
        label: 'Count',
        data: [1200, 85, 3300],
        backgroundColor: ['#2563eb', '#10b981', '#f97316'],
        borderRadius: 5,
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [300, 200, 2600, 200],
        backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8 ">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 dark:text-white">
        <div className="bg-white p-4 rounded-xl shadow space-y-2 dark:bg-gray-600 ">
          <h2 className="text-sm font-medium text-gray-600 dark:text-white">Total Customers</h2>
          <p className="text-3xl font-bold text-blue-600">1,200</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-2 dark:bg-gray-600">
          <h2 className="text-sm font-medium text-gray-600 dark:text-white">Total Restaurants</h2>
          <p className="text-3xl font-bold text-green-600">85</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-2 dark:bg-gray-600">
          <h2 className="text-sm font-medium text-gray-600 dark:text-white">Total Orders</h2>
          <p className="text-3xl font-bold text-orange-500">3,300</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Statistics</h3>
          <Bar data={userStats} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Status</h3>
          <Doughnut data={orderStatusData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6 dark:bg-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activities</h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-white">
          <li>✅ New restaurant <strong>FreshBites</strong> registered</li>
          <li>✅ Order <strong>#B14322</strong> delivered successfully</li>
          <li>❌ Restaurant <strong>Taco Villa</strong> suspended for policy violation</li>
          <li>✅ Customer <strong>Jane Cooper</strong> signed up</li>
        </ul>
      </div>
    </div>
  );
}
