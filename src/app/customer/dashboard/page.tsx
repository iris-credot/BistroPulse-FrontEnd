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
  ChartOptions,
} from 'chart.js';

import { Card, CardContent } from '../../../../components/CardDashboard';
import {
  ShoppingCart,
  Heart,
  Wallet,
  Clock,
  // --- ADDED: Icons for the calendar ---
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// --- ADDED: The ScheduleCalendar component ---
const ScheduleCalendar = () => {
  // --- FIX: INITIALIZE WITH CURRENT DATE ---
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  // --- FIX: GET TODAY'S DATE FOR COMPARISON ---
  const today = new Date();


  const generateCalendarDays = () => {
    const daysArray = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        daysArray.push({ day: daysInPrevMonth - i, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        // --- FIX: DYNAMICALLY CHECK FOR TODAY ---
        const isSelected = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        daysArray.push({ day, inMonth: true, isSelected, isToday });
    }
    while (daysArray.length % 7 !== 0) {
        daysArray.push({ day: daysArray.length - (firstDayOfMonth + daysInMonth) + 1, inMonth: false});
    }
    return daysArray;
  };

  const days = generateCalendarDays();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">My Calendar</h3>
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button title='s' onClick={handlePrevMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-700 dark:text-gray-200">{monthName}, {year}</div>
        <button title='g' onClick={handleNextMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="font-medium text-gray-500 dark:text-gray-400">{day}</div>
        ))}
        {days.map(({ day, inMonth, isSelected, isToday }, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg cursor-pointer ${
              !inMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
            } ${
              isSelected ? 'bg-purple-600 text-white font-bold' : ''
            } ${
              isToday ? 'bg-purple-100 dark:bg-purple-900/50' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};


const CustomerDashboard = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return 'Good morning';
      if (currentHour < 18) return 'Good afternoon';
      return 'Good evening';
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

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Weekly Spending Overview' },
    },
    animation: { duration: 1000, easing: 'easeOutQuad' },
    scales: { y: { beginAtZero: true } }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="p-6 space-y-6">
        <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            Hello Client <span className="text-2xl ml-2">👋</span>
        </h1>
          <motion.h1
        className="text-2xl font-bold text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {greeting}
      </motion.h1>
      </div>
    

      {/* --- MODIFIED: Main grid to hold stats/chart on left and calendar on right --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Container for existing cards and chart (takes 2/3 of the width) --- */}
        <div className="lg:col-span-2">
          <motion.div
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2" // Note: lg changed to 2 cols to fit
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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
            
            {/* Chart now spans the 2 columns of its container */}
            <motion.div className="col-span-1 md:col-span-2 lg:col-span-2" variants={itemVariants}>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <Bar options={barOptions} data={barData} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* --- ADDED: Container for the calendar (takes 1/3 of the width) --- */}
        <motion.div className="lg:col-span-1" variants={itemVariants} initial="hidden" animate="visible">
            <ScheduleCalendar />
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;