'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  // --- IMPORT CHART & PLUGIN TYPES ---
  ChartOptions,
  
} from 'chart.js';
// --- IMPORT FRAMER MOTION TYPES ---
import { motion, Variants } from 'framer-motion';

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

  // --- FIX 1: EXPLICITLY TYPE THE VARIANTS OBJECT ---
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" // This is now correctly typed
      }
    }
  };

  // --- FIX 2: EXPLICITLY TYPE THE BAR CHART OPTIONS ---
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuad', // This is now correctly typed
    },
    scales: { // It's good practice to define scales
        y: {
            beginAtZero: true
        }
    }
  };

  // --- FIX 3: EXPLICITLY TYPE THE DOUGHNUT CHART OPTIONS ---
  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuad', // This is now correctly typed
    },
    plugins: {
        legend: {
            position: 'top', // This is now correctly typed
        }
    },
    cutout: '60%', // Makes the doughnut hole a bit smaller for better aesthetics
  };


  return (
    <motion.div
      className="p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 dark:text-white">
        <div className="bg-white p-4 rounded-xl shadow space-y-2 dark:bg-gray-600">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Statistics</h3>
          <Bar data={userStats} options={barChartOptions} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Status</h3>
          <Doughnut data={orderStatusData} options={doughnutOptions} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow mt-6 dark:bg-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activities</h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-white">
          <li>✅ New restaurant <strong>FreshBites</strong> registered</li>
          <li>✅ Order <strong>#B14322</strong> delivered successfully</li>
          <li>❌ Restaurant <strong>Taco Villa</strong> suspended for policy violation</li>
          <li>✅ Customer <strong>Jane Cooper</strong> signed up</li>
        </ul>
      </div>
    </motion.div>
  );
}