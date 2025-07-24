'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
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

// Assume you have a translation hook setup from a library like 'react-i18next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
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
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{t('my_calendar')}</h3>
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button title='e' onClick={handlePrevMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-700 dark:text-gray-200">{monthName}, {year}</div>
        <button title='d' onClick={handleNextMonth} className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {weekdays.map((day, index) => (
          <div key={index} className="font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map(({ day, inMonth, isSelected, isToday }, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg cursor-pointer ${!inMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
              } ${isSelected ? 'bg-purple-600 text-white font-bold' : ''
              } ${isToday ? 'bg-purple-100 dark:bg-purple-900/50' : ''
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
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');
  const [businessName, setBusinessName] = useState<string>('Loading...');

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token || !userId || !apiBaseUrl) {
        console.warn("User data or API config not found for profile fetching.");
       
        setBusinessName('Owner Dashboard'); // Set default on failure
        setIsLoadingProfile(false);
        return;
      }

      try {
      

        // --- Fetch 2: Get Owner's info (businessName) using the same userId ---
        const ownerResponse = await fetch(`${apiBaseUrl}/owner/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!ownerResponse.ok) {
          // This is not a critical error; the user might just not be an owner.
          console.warn("Could not fetch owner profile for this user.");
          setBusinessName('My Dashboard'); // Set a generic default
        } else {
          const ownerData = await ownerResponse.json();
          // Set the business name if it exists, otherwise provide a fallback.
          if (ownerData.owner && ownerData.owner.businessName) {
            setBusinessName(ownerData.owner.businessName);
          } else {
            setBusinessName('My Business');
          }
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
        // 'E' for Error
        setBusinessName('Owner Dashboard'); // Fallback name on error
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);


  useEffect(() => {
    const getCurrentGreetingKey = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'good_morning';
      } else if (currentHour < 18) {
        return 'good_afternoon';
      } else {
        return 'good_evening';
      }
    };
    setGreeting(t(getCurrentGreetingKey()));
  }, [t]);

  const userStats: ChartData<'bar'> = {
    labels: [t('chart_labels.customers'), t('chart_labels.restaurants'), t('chart_labels.orders')],
    datasets: [
      {
        label: t('count_label'),
        data: [1200, 85, 3300],
        backgroundColor: ['#2563eb', '#10b981', '#f97316'],
        borderRadius: 5,
      },
    ],
  };

  const orderStatusData: ChartData<'doughnut'> = {
    labels: [t('chart_labels.pending'), t('chart_labels.preparing'), t('chart_labels.delivered'), t('chart_labels.cancelled')],
    datasets: [
      {
        data: [300, 200, 2600, 200],
        backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    animation: { duration: 1000, easing: 'easeOutQuad' },
    scales: { y: { beginAtZero: true } }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    animation: { animateRotate: true, animateScale: true, duration: 1000, easing: 'easeOutQuad' },
    plugins: { legend: { position: 'top' } },
    cutout: '60%',
  };


  return (
    <motion.div
      className="p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
       <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
  {t('dashboard.greeting.hello')}{' '} {/* Add a space for readability */}
  {isLoadingProfile ? (
    // If loading, show a skeleton placeholder
    <span className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2"></span>
  ) : (
    // If not loading, show the actual business name
    <>{businessName}</>
  )}
  <span className="text-2xl ml-2">👋</span>
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
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('new_users')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3" />
                <span className="ml-1 font-semibold">12%</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">{t('update')}: July 19, 2025</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('total_clients')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">7</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3" />
                <span className="ml-1 font-semibold">5%</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">{t('update')}: July 19, 2025</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('total_dishes')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">16</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <CalendarCheck className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-red-600 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full">
                <ArrowDown className="w-3 h-3" />
                <span className="ml-1 font-semibold">8%</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">{t('update')}: July 19, 2025</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('orders')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <FolderKanban className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3" />
                <span className="ml-1 font-semibold">12%</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">{t('update')}: July 19, 2025</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ScheduleCalendar />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('clients_statistics')}</h3>
          <Bar data={userStats} options={barChartOptions} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('order_status')}</h3>
          <Doughnut data={orderStatusData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('recent_activities')}</h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-white">
          <li dangerouslySetInnerHTML={{ __html: `✅ ${t('recent_activities_list.new_restaurant')}` }} />
          <li dangerouslySetInnerHTML={{ __html: `✅ ${t('recent_activities_list.order_delivered')}` }} />
          <li dangerouslySetInnerHTML={{ __html: `❌ ${t('recent_activities_list.restaurant_suspended')}` }} />
          <li dangerouslySetInnerHTML={{ __html: `✅ ${t('recent_activities_list.customer_signed_up')}` }} />
        </ul>
      </div>
    </motion.div>
  );
}