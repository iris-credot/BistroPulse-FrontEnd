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
  // --- IMPORT CHART OPTIONS TYPE FOR TYPESAFETY ---
  ChartOptions,
} from 'chart.js';

import { Card, CardContent } from '../../../../components/CardDashboard';
import {
  ShoppingCart,
  Heart,
  Wallet,
  Clock,
} from 'lucide-react';
// --- IMPORT FRAMER MOTION FOR ANIMATIONS ---
import { motion, Variants } from 'framer-motion';
// --- IMPORT REACT HOOKS ---
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CustomerDashboard = () => {
  const [greeting, setGreeting] = useState('');

  // --- SETS THE GREETING BASED ON THE TIME OF DAY ---
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
        label: 'Spending (₵)',
        data: [35, 50, 20, 40, 70, 90, 60],
        backgroundColor: '#10b981',
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
        text: 'Weekly Spending Overview',
      },
    },
    animation: { // Animates the chart bars on render
      duration: 1000,
      easing: 'easeOutQuad',
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  // --- VARIANTS FOR THE STAGGERED ANIMATION ---

  // Container for the grid to manage staggered children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each card animates 0.1s after the previous one
      },
    },
  };

  // Animation for each card item
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 }, // Starts slightly below and invisible
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
    <div className="p-6 space-y-6">
      {/* --- GREETING MESSAGE --- */}
      <motion.h1 
        className="text-2xl font-bold text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {greeting}, Brenda
      </motion.h1>

      <motion.div
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Customer Stats Cards with individual animations */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">My Orders</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Heart className="w-8 h-8 text-pink-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Favorites</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Wallet className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Total Spent</p>
                <p className="text-xl font-bold">₵ 1,200</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-white">Last Order</p>
                <p className="text-xl font-bold">2 days ago</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart card with its own animation in the sequence */}
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

export default CustomerDashboard;