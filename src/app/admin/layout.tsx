// src/app/admin/layout.tsx
"use client"; 
import React from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { LayoutDashboard, Utensils, Users, Bell, LogOut, ShoppingCart, History } from 'lucide-react';
import { useTheme } from '../../../components/darkTheme';
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { LanguageProvider } from '../../../components/LanguageProvider';
// --- IMPORT FRAMER MOTION ---
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); // Get the current path for the animation key
    const { darkMode, toggleDarkMode } = useTheme();

    const handleLogout = async () => {
      try {
        await axios.post(
          "https://bistroupulse-backend.onrender.com/api/user/logout",
          {},
          { withCredentials: true }
        );
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout');
      }
    };

    // --- ANIMATION VARIANTS ---

    // Animation for the Header (slides down)
    const headerVariants: Variants = {
      hidden: { y: -100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    // Animation for the Sidebar (slides in from the left)
    const sidebarVariants: Variants = {
      hidden: { x: -250, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
    };

    // Animation for the Main Content Area (fade in and slide up)
    const mainVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Animated Navbar */}
      <motion.header 
        className="bg-white shadow-sm z-10 dark:bg-gray-950"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex justify-center items-center space-x-2">
             <Image 
                src="/icon.png" 
                alt="BistroPulse Logo" 
                width={32}  
                height={32} 
                priority 
              />
             <h1 className="text-xl font-bold text-blue-500">BistroPulse</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button title='Notifications' className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>{ router.push('/admin/settings');}}>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                DS
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Darnell Steward</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Animated Sidebar */}
        <motion.aside 
          className="w-64 bg-white text-gray-500 p-4 flex flex-col dark:bg-gray-950"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1">
            <nav className='mt-4'>
              <ul className="space-y-2">
                {/* I've added animation classes to each link */}
                <li>
                  <a href="/admin/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/restaurents" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <Utensils className="w-5 h-5" />
                    <span>Restaurants</span>
                  </a>
                </li>
                {/* ... Apply the same classes to other links ... */}
                 <li>
                  <a href="/admin/customer-list" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <Users className="w-5 h-5" />
                    <span>Representatives</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/users" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Users</span>
                  </a>
                </li>
                 <li>
                  <a href="/admin/food-menu" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <Utensils className="w-5 h-5" />
                    <span> Menu</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100">
                    <History className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex md:flex-row gap-4 w-full mb-3 justify-center items-center">
              <label className="text-base font-semibold">DarkMode</label>
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`flex justify-center items-center rounded-lg px-5 py-2 gap-3 border transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  darkMode ? "bg-blue-500 text-white border-blue-500" : "bg-white text-black border-black"
                }`}
              >
                <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
                <span>{darkMode ? "On" : "Off"}</span>
              </button>
            </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ul className="space-y-1">
              <li onClick={handleLogout}>
                <a className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 active:scale-100 cursor-pointer">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </motion.aside>

        {/* Animated Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname} // This key is CRUCIAL for AnimatePresence to work on route changes
              variants={mainVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <LanguageProvider>{children}</LanguageProvider>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}