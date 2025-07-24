'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import LoadingSpinner from 'components/loadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  ClipboardList,
  FolderKanban,
  CalendarCheck,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

interface UserFromAPI {
  _id: string;
  names?: string;

}
const ScheduleCalendar = () => {
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
      const isToday = isSelected;
      daysArray.push({ day, inMonth: true, isSelected, isToday });
    }

    while (daysArray.length % 7 !== 0) {
      daysArray.push({ day: daysArray.length - (firstDayOfMonth + daysInMonth) + 1, inMonth: false });
    }

    return daysArray;
  };

  const days = generateCalendarDays();
  const weekdays = t('dashboard.calendar.weekdays', { returnObjects: true }) as string[];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
          {t('dashboard.calendar.title')}
        </h3>
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          title={t('dashboard.calendar.prevMonth')}
          onClick={handlePrevMonth}
          className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-700 dark:text-gray-200">
          {monthName}, {year}
        </div>
        <button
          title={t('dashboard.calendar.nextMonth')}
          onClick={handleNextMonth}
          className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {weekdays.map((day, idx) => (
          <div key={idx} className="font-medium text-gray-500 dark:text-gray-400">{day}</div>
        ))}
        {days.map(({ day, inMonth, isSelected, isToday }, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg cursor-pointer ${
              !inMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
            } ${isSelected ? 'bg-purple-600 text-white font-bold' : ''} ${
              isToday && !isSelected ? 'bg-purple-100 dark:bg-purple-900/50' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [error, setError] = useState<string | null>(null);
   const [user, setUser] = useState<UserFromAPI | null>(null);
      
     

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return t('dashboard.greeting.morning');
      if (hour < 18) return t('dashboard.greeting.afternoon');
      return t('dashboard.greeting.evening');
    };
    setGreeting(getGreeting());
  }, [t]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
       const token = localStorage.getItem('token'); // Or get it from context/state

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const [clientsRes, usersRes, restaurantsRes, ownersRes] = await Promise.all([
      fetch(`${apiBaseUrl}/user/allClients`, { headers }),
      fetch(`${apiBaseUrl}/user/all`, { headers }),
      fetch(`${apiBaseUrl}/restaurant`, { headers }),
      fetch(`${apiBaseUrl}/owner`, { headers }),
    ]);

        if (!clientsRes.ok || !usersRes.ok || !restaurantsRes.ok || !ownersRes.ok) {
          throw new Error('One or more API requests failed');
        }
const clientsData = await clientsRes.json();
const usersData = await usersRes.json();
const restaurantsData = await restaurantsRes.json();
const ownersData = await ownersRes.json();
       setTotalClients(clientsData.clients.length);
setTotalUsers(usersData.users.length);
setTotalRestaurants(restaurantsData.restaurants.length);
setTotalManagers(ownersData.owners.length);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [apiBaseUrl]);
   useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
     
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

    

        const response = await fetch(`${API_BASE_URL}/api/user/getOne/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const data = await response.json();
        const userData = data.user || data;
        setUser(userData);
        
        // --- MODIFIED: Use the helper to set a safe URL ---
      

      } catch (err) {
       console.log(err)
       
        
        // Fallback to default avatar on error
       
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);
  const userStats: ChartData<'bar'> = {
    labels: t('dashboard.charts.userStats.labels', { returnObjects: true }) as string[],
    datasets: [
      {
        label: t('dashboard.charts.userStats.label'),
        data: [1200, 85, 3300],
        backgroundColor: ['#2563eb', '#10b981', '#f97316'],
        borderRadius: 5,
      },
    ],
  };

  const orderStatusData: ChartData<'doughnut'> = {
    labels: t('dashboard.charts.restaurantStatus.labels', { returnObjects: true }) as string[],
    datasets: [
      {
        data: [300, 200, 2600, 200],
        backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  const recentActivities = t('dashboard.recentActivities.activities', { returnObjects: true }) as string[];

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    animation: { duration: 1000, easing: 'easeOutQuad' },
    scales: { y: { beginAtZero: true } },
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    animation: { animateRotate: true, animateScale: true, duration: 1000, easing: 'easeOutQuad' },
    plugins: { legend: { position: 'top' } },
    cutout: '60%',
  };

  const statsCards = [
    {
      title: t('dashboard.statsCards.totalUsers.title'),
      value: totalUsers,
      icon: Users,
      color: 'blue',
      change: '+12%',
    },
    {
      title: t('dashboard.statsCards.totalManagers.title'),
      value: totalManagers,
      icon: ClipboardList,
      color: 'green',
      change: '+5%',
    },
    {
      title: t('dashboard.statsCards.totalRestaurants.title'),
      value: totalRestaurants,
      icon: CalendarCheck,
      color: 'red',
      change: '-8%',
    },
    {
      title: t('dashboard.statsCards.totalClients.title'),
      value: totalClients,
      icon: FolderKanban,
      color: 'purple',
      change: '+12%',
    },
  ];

  if (loading) return <div className="p-6 text-lg"><LoadingSpinner/></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <motion.div className="p-6 space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          {t('dashboard.greeting.hello')} 
          
               {loading ? (
    // If loading, show a skeleton placeholder
    <span className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2"></span>
  ) : (
    // If not loading, show the actual business name
    <> {user?.names}</>
  )} <span className="ml-2 text-2xl">👋</span>
        </h1>
        <motion.h2
          className="text-2xl font-bold text-gray-800 dark:text-white mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {greeting}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {statsCards.map((card, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
                <div className={`p-2 bg-${card.color}-100 dark:bg-${card.color}-900/50 rounded-lg`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-500 dark:text-${card.color}-400`} />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2 text-sm">
                <div className={`flex items-center text-${card.color}-600 bg-${card.color}-100 dark:bg-${card.color}-900/50 px-2 py-0.5 rounded-full`}>
                  {card.change.includes('-') ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  <span className="ml-1 font-semibold">{card.change}</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500">{t('dashboard.statsCards.update', { date: 'July 19, 2025' })}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <ScheduleCalendar />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dashboard.charts.userStats.title')}</h3>
          <Bar data={userStats} options={barChartOptions} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dashboard.charts.restaurantStatus.title')}</h3>
          <Doughnut data={orderStatusData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dashboard.recentActivities.title')}</h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-white">
          {recentActivities.map((activity, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: activity }} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
