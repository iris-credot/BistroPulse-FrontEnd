'use client';

import React, { useState, useEffect, useRef } from 'react';

import { Home, Utensils, ShoppingCart, LogOut, MapPin, Clock, Bell, History, Globe, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../../../components/darkTheme';
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next'; // Ibyongewe
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const { t, i18n } = useTranslation(); // Ibyongewe
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode, toggleDarkMode } = useTheme();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Byahinduwe
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

   const handleLogout = () => {
    try {
        console.log("Performing local logout: clearing storage.");

        // Remove the user's token and ID from browser storage.
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Redirect the user to the login page.
        router.push('/login');

    } catch (error) {
        // This catch block will run if localStorage is inaccessible or another error occurs.
        console.error('An error occurred during local logout:', error);

        // As a fallback, still try to navigate the user away.
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
            <nav className="mt-4 flex-1">
                <ul className="space-y-2">
                    <li><Link href="/customer/dashboard" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Home className="w-5 h-5" /><span>{t('sidebarC.dashboard')}</span></Link></li>
                    <li><Link href="/customer/restaurents" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span>{t('sidebarC.restaurants')}</span></Link></li>
                    <li><Link href="/customer/my-orders" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><ShoppingCart className="w-5 h-5" /><span>{t('sidebarC.myOrders')}</span><span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3</span></Link></li>
                    <li><Link href="/customer/my-addresses" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><MapPin className="w-5 h-5" /><span>{t('sidebarC.myAddresses')}</span></Link></li>
                    <li><Link href="/customer/order-history" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Clock className="w-5 h-5" /><span>{t('sidebarC.orderHistory')}</span></Link></li>
                    <li><Link href="/customer/settings" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><History className="w-5 h-5" /><span>{t('sidebarC.settings')}</span></Link></li>
                    <li><a href="/customer/notifications" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Bell className="w-5 h-5" /><span>{t('sidebarC.notifications')}</span></a></li>
                </ul>
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex md:flex-row gap-12 w-full mb-3 justify-center items-center">
                       <label className="text-base font-semibold">{t('sidebarC.darkMode')}</label>
                       <button type="button" onClick={toggleDarkMode} className={`flex justify-center items-center rounded-lg px-2 py-1 gap-3 border transition-all duration-200 transform hover:scale-105 active:scale-95 ${darkMode ? "bg-blue-500 text-white border-blue-500" : "bg-white text-black border-black"}`}>
                         <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
                         <span>{darkMode ? t('sidebarC.on') : t('sidebarC.off')}</span>
                       </button>
                     </div>
                <ul className="space-y-2">
                    <li onClick={handleLogout} className="w-full">
                        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 active:scale-100 cursor-pointer">
                            <LogOut className="w-5 h-5" />
                            <span>{t('sidebarC.logout')}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <motion.header
                className="bg-white shadow-sm z-20 dark:bg-gray-950"
                variants={headerVariants} initial="hidden" animate="visible"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <Image src="/icon.png" alt="BistroPulse Logo" width={32} height={32} priority />
                        <h1 className="text-xl ml-2 font-bold text-blue-500">{t('headerC.brand')}</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                title={t('headerC.changeLanguageTitle')}
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
                                        <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerC.lang.en')}</button>
                                        <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerC.lang.fr')}</button>
                                        <button onClick={() => changeLanguage('sw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerC.lang.sw')}</button>
                                        <button onClick={() => changeLanguage('rw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('headerC.lang.rw')}</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { router.push('/customer/profile'); }}>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">CU</div>
                        </div>
                        <button title={t('headerC.toggleMenuTitle')} onClick={toggleSidebar} className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300">
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
                                    <button title={t('headerC.closeMenuTitle')} onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>
                                {sidebarContent}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <motion.aside
                    className="hidden md:flex w-64 bg-white text-gray-500 p-4 flex-col border-r border-gray-200 dark:border-gray-800 dark:bg-gray-950"
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