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
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
// --- ADDED: Import for translation ---
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScheduleCalendar = () => {
  // --- ADDED: i18n hook ---
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  // --- MODIFIED: Get month name from translations ---
  const monthName = t(`dashboard.calendar.months.${month}`);
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
  // --- MODIFIED: Get weekday names from translations ---
  const weekdays = t('dashboardC.calendar.weekdays', { returnObjects: true });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        {/* --- MODIFIED: Translated title --- */}
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{t('dashboardC.calendar.title')}</h3>
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        {/* --- MODIFIED: Translated button titles --- */}
        <button title={t('dashboardC.calendar.prevMonth')} onClick={handlePrevMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-700 dark:text-gray-200">{monthName}, {year}</div>
        <button title={t('dashboardC.calendar.nextMonth')} onClick={handleNextMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {/* --- MODIFIED: Safely map translated weekdays --- */}
        {Array.isArray(weekdays) && weekdays.map(day => (
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
  // --- ADDED: i18n hook ---
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');

  // --- MODIFIED: Use translated greetings and add 't' to dependency array ---
  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return t('dashboardC.greeting.morning');
      if (currentHour < 18) return t('dashboardC.greeting.afternoon');
      return t('dashboardC.greeting.evening');
    };
    setGreeting(getCurrentGreeting());
  }, [t]);

  // --- MODIFIED: Use translated chart data ---
  const barData = {
    labels: t('dashboardC.chart.weekdays', { returnObjects: true }) as string[],
    datasets: [
      {
        label: t('dashboardC.chart.label'),
        data: [35, 50, 20, 40, 70, 90, 60],
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  // --- MODIFIED: Use translated chart options ---
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: t('dashboardC.chart.title') },
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
        {/* --- MODIFIED: Translated heading --- */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            {t('dashboardC.greeting.hello')} <span className="text-2xl ml-2">👋</span>
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
    

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* --- MODIFIED: Translated cards --- */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-white">{t('dashboardC.cards.orders')}</p>
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
                    <p className="text-sm text-gray-500 dark:text-white">{t('dashboardC.cards.favorites')}</p>
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
                    <p className="text-sm text-gray-500 dark:text-white">{t('dashboardC.cards.totalSpent')}</p>
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
                    <p className="text-sm text-gray-500 dark:text-white">{t('dashboardC.cards.lastOrder')}</p>
                    <p className="text-xl font-bold">{t('dashboardC.cards.lastOrderValue')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div className="col-span-1 md:col-span-2 lg:col-span-2" variants={itemVariants}>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <Bar options={barOptions} data={barData} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="lg:col-span-1" variants={itemVariants} initial="hidden" animate="visible">
            <ScheduleCalendar />
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;