'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../../../components/darkTheme';
import { LayoutDashboard, Utensils, Users, Bell, LogOut, ShoppingCart, History, Globe, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();
  
  // --- STATE FOR USER AND OWNER PROFILE ---
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>('..');
  const [businessName, setBusinessName] = useState<string>('Loading...'); // ** NEW STATE for Business Name **
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsDropdownOpen(false);
  };

  // --- MODIFIED: This useEffect now fetches both user and owner data ---
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token || !userId || !apiBaseUrl) {
        console.warn("User data or API config not found for profile fetching.");
        setUserInitials('??');
        setBusinessName('Owner Dashboard'); // Set default on failure
        setIsLoadingProfile(false);
        return;
      }

      try {
        // --- Fetch 1: Get User's basic info (image, name) ---
        const userResponse = await fetch(`${apiBaseUrl}/user/getOne/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user profile');
        
        const userData = await userResponse.json();
        if (userData.user) {
          setUserImage(userData.user.image || null);
          const name = userData.user.name || '';
          const nameParts = name.split(' ');
          const initials = nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
            : name.substring(0, 2);
          setUserInitials(initials.toUpperCase() || '??');
        }

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
        setUserInitials('E'); // 'E' for Error
        setBusinessName('Owner Dashboard'); // Fallback name on error
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId'); // Also remove userId for consistency
      router.push('/login');
    } catch (error) {
      console.error('An error occurred during local logout:', error);
      router.push('/login');
    }
  };

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

  const sidebarContent = (
    <>
      <div className="flex-1">
        <nav className='mt-4'>
          <ul className="space-y-2">
            <li><a href="/owner/dashboard" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><LayoutDashboard className="w-5 h-5" /><span>{t('sidebarO.overview')}</span></a></li>
            <li><a href="/owner/customer-list" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Users className="w-5 h-5" /><span>{t('sidebarO.customerList')}</span></a></li>
            <li><a href="/owner/restaurants" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span>Restaurants</span></a></li>
            <li><a href="/owner/customer-order" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><ShoppingCart className="w-5 h-5" /><span>{t('sidebarO.order')}</span></a></li>
            <li><a href="/owner/food-menu" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span>{t('sidebarO.foodMenu')}</span></a></li>
            <li><a href="/owner/settings" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><History className="w-5 h-5" /><span>{t('sidebarO.settings')}</span></a></li>
            <li><a href="/owner/notifications" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Bell className="w-5 h-5" /><span>{t('sidebarO.notifications')}</span></a></li>
          </ul>
        </nav>
      </div>
      <div className="flex md:flex-row gap-12 w-full mb-3 justify-center items-center">
        <label className="text-base font-semibold">{t('sidebarO.darkMode')}</label>
        <button type="button" onClick={toggleDarkMode} className={`flex justify-center items-center rounded-lg px-2 py-1 gap-3 border transition-all duration-200 transform hover:scale-105 active:scale-95 ${darkMode ? "bg-blue-500 text-white border-blue-500" : "bg-white text-black border-black"}`}>
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
          <span>{darkMode ? t('sidebarO.on') : t('sidebarO.off')}</span>
        </button>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <ul className="space-y-1">
          <li onClick={handleLogout}>
            <a className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 active:scale-100 cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span>{t('sidebarO.logout')}</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <motion.header
        className="bg-white shadow-sm z-20 dark:bg-gray-950"
        variants={headerVariants} initial="hidden" animate="visible"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2">
            <Image src="/icon.png" alt="BistroPulse Logo" width={32} height={32} priority />
            {/* ** MODIFIED: Display dynamic business name ** */}
            <h1 className="text-xl ml-2 font-bold text-blue-500">{businessName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                title={t('headerO.changeLanguageTitle')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Globe className="w-8 h-8 text-blue-500" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1 ring-1 ring-black ring-opacity-5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerO.lang.en')}</button>
                    <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerO.lang.fr')}</button>
                    <button onClick={() => changeLanguage('sw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerO.lang.sw')}</button>
                    <button onClick={() => changeLanguage('rw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerO.lang.rw')}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/owner/profile')}>
              {isLoadingProfile ? (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
              ) : userImage ? (
                <Image
                  src={userImage}
                  alt="User Profile"
                  width={32}
                  height={32}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userInitials}
                </div>
              )}
            </div>
            <button title={t('headerO.toggleMenuTitle')} onClick={toggleSidebar} className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
                onClick={toggleSidebar}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              />
              <motion.aside
                className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-950 z-40 p-4 flex flex-col md:hidden"
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              >
                <div className="flex justify-end mb-4">
                  <button title={t('headerO.closeMenuTitle')} onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                    <X className="w-8 h-8" />
                  </button>
                </div>
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        <motion.aside
          className="hidden md:flex w-64 bg-white text-gray-500 p-4 flex-col dark:bg-gray-950 border-r dark:border-gray-800"
          variants={sidebarVariants} initial="hidden" animate="visible"
        >
          {sidebarContent}
        </motion.aside>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={mainVariants} initial="hidden" animate="visible" exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}