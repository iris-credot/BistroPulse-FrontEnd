"use client";
// --- IMPORT REACT HOOKS ---
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  // --- IMPORT CHART OPTIONS TYPE ---
  ChartOptions,
} from 'chart.js';
import { Card, CardContent } from '../../../../components/CardDashboard';
import { Bell, Users, Utensils, LayoutDashboard } from 'lucide-react';
// --- IMPORT FRAMER MOTION ---
import { motion, Variants } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // --- STATE FOR THE DYNAMIC GREETING ---
  const [greeting, setGreeting] = useState('');

  // --- SET GREETING BASED ON THE TIME OF DAY ---
  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good morning';
      } else if (currentHour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    };
    setGreeting(getCurrentGreeting());
  }, []);


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

  // --- ADDED TYPE AND ANIMATION TO CHART OPTIONS ---
  const barOptions: ChartOptions<'bar'> = {
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
    animation: { // Animation for the chart itself
      duration: 1000,
      easing: 'easeOutQuad',
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  // --- VARIANTS FOR PAGE AND CARD ANIMATIONS ---

  // Staggered container for the grid
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
      },
    },
  };

  // Animation for each individual card
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 }, // Start 20px below and invisible
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
  };

  return (
    // Use a wrapping div to contain both the greeting and the grid
    <div className="p-6 space-y-6">
      {/* --- GREETING MESSAGE --- */}
      <motion.h1
        className="text-2xl font-bold text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {greeting}, Iris
      </motion.h1>

      <motion.div
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Statistic Cards with individual animations */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Total Orders</p>
                <p className="text-xl font-bold">2,345</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">New Users</p>
                <p className="text-xl font-bold">425</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Utensils className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Top Dish</p>
                <p className="text-xl font-bold dark:text-white">Pizza</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Bell className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Alerts</p>
                <p className="text-xl font-bold">7</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Section with its own animation */}
        <motion.div className="col-span-1 md:col-span-2 lg:col-span-4" variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <Bar options={barOptions} data={barData} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;