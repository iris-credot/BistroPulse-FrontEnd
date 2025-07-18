'use client';

import React, { useState } from 'react'; // Import useState
import axios from "axios";
// --- Import Menu and X icons for mobile toggle ---
import { Home, Utensils, ShoppingCart,  LogOut, MapPin, Clock, Bell, History, Menu, X } from 'lucide-react'; 
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../../../components/darkTheme';
import { useRouter, usePathname } from "next/navigation";
import { LanguageProvider } from '../../../components/LanguageProvider';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();
  
  // --- State to control mobile sidebar visibility ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  // --- Animation Variants (No changes here) ---
  const headerVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const sidebarVariants: Variants = {
    hidden: { x: -250, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  const mainVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
  };
  
  // --- Sidebar content separated for reuse ---
  const sidebarContent = (
    <>
        <nav className="mt-4 flex-1">
            <ul className="space-y-2">
              <li><Link href="/customer/dashboard" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Home className="w-5 h-5" /><span>Dashboard</span></Link></li>
              <li><Link href="/customer/restaurents" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span>Restaurants</span></Link></li>
              <li><Link href="/customer/my-orders" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><ShoppingCart className="w-5 h-5" /><span>My Orders</span><span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3</span></Link></li>
              <li><Link href="/customer/my-addresses" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><MapPin className="w-5 h-5" /><span>My Addresses</span></Link></li>
              <li><Link href="/customer/order-history" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Clock className="w-5 h-5" /><span>Order History</span></Link></li>
              <li><Link href="/customer/settings" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><History className="w-5 h-5" /><span>Settings</span></Link></li>
               <li><a href="/customer/notifications" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Bell className="w-5 h-5" /><span>Notifications</span></a></li>
            </ul>
        </nav>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex md:flex-row gap-12 w-full mb-3 justify-center items-center">
              <label className="text-base font-semibold">DarkMode</label>
              <button type="button" onClick={toggleDarkMode} className={`flex justify-center items-center rounded-lg px-5 py-2 gap-3 border transition-all duration-200 transform hover:scale-105 active:scale-95 ${darkMode ? "bg-blue-500 text-white border-blue-500" : "bg-white text-black border-black"}`}>
                <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
                <span>{darkMode ? "On" : "Off"}</span>
              </button>
            </div>
          <ul className="space-y-2">
            <li onClick={handleLogout} className="w-full">
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 active:scale-100 cursor-pointer">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Animated Navbar */}
      <motion.header
        className="bg-white shadow-sm z-10 dark:bg-gray-950"
        variants={headerVariants} initial="hidden" animate="visible"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2">
            {/* --- Hamburger button for mobile, hidden on medium screens and up --- */}
           
            <Image src="/icon.png" alt="BistroPulse Logo" width={32} height={32} priority />
            <h1 className="text-xl font-bold text-blue-500">BistroPulse</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button title="Notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
           
            <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>{ router.push('/customer/settings');}}>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">CU</div>
             
            </div>
             <button title='h' onClick={toggleSidebar} className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300">
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- MOBILE SIDEBAR DRAWER (ANIMATED) --- */}
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-transparent bg-opacity-50 z-20 md:hidden"
                        onClick={toggleSidebar}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />
                    <motion.aside
                        className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-950 z-30 p-4 flex flex-col md:hidden"
                        initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                    >
                      <div className="flex justify-end mb-4">
                        <button title='g' onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      {sidebarContent}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>

        {/* --- DESKTOP SIDEBAR (STATIC & ANIMATED ON LOAD) --- */}
        {/* --- Hidden on mobile (md:flex) --- */}
        <motion.aside
          className="hidden md:flex w-64 bg-white text-gray-500 p-4 flex-col border-r border-gray-200 dark:border-gray-800 dark:bg-gray-950"
          variants={sidebarVariants} initial="hidden" animate="visible"
        >
            {sidebarContent}
        </motion.aside>

        {/* Animated Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={mainVariants} initial="hidden" animate="visible" exit="exit"
            >
              <LanguageProvider>{children}</LanguageProvider>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}