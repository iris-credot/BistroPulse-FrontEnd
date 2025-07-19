// src/app/admin/layout.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { LayoutDashboard, Utensils, Users, Bell, LogOut, ShoppingCart, History, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../../../components/darkTheme';
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import { LanguageProvider } from '../../../components/LanguageProvider';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode, toggleDarkMode } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLanguageSelect = (language: string) => {
        console.log(`Language selected: ${language}`);
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
    }, []); // Removed dropdownRef from dependency array as it's stable

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
                        <li><a href="/admin/dashboard" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><LayoutDashboard className="w-5 h-5" /><span>Dashboard</span></a></li>
                        <li><a href="/admin/restaurents" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span>Restaurants</span></a></li>
                        <li><a href="/admin/customer-list" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Users className="w-5 h-5" /><span>Representatives</span></a></li>
                        <li><a href="/admin/users" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><ShoppingCart className="w-5 h-5" /><span>Users</span></a></li>
                        <li><a href="/admin/food-menu" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Utensils className="w-5 h-5" /><span> Menu</span></a></li>
                        <li><a href="/admin/notifications" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><Bell className="w-5 h-5" /><span>Notifications</span></a></li>
                        <li><a href="/admin/settings" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black hover:scale-105 active:scale-100"><History className="w-5 h-5" /><span>Settings</span></a></li>
                    </ul>
                </nav>
            </div>
           <div className="flex md:flex-row gap-12 w-full mb-3 justify-center items-center">
                  <label className="text-base font-semibold">DarkMode</label>
                  <button type="button" onClick={toggleDarkMode} className={`flex justify-center items-center rounded-lg px-2 py-1 gap-3 border transition-all duration-200 transform hover:scale-105 active:scale-95 ${darkMode ? "bg-blue-500 text-white border-blue-500" : "bg-white text-black border-black"}`}>
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
        </>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            <motion.header
                className="bg-white shadow-sm z-20 dark:bg-gray-950" // Increased z-index
                variants={headerVariants} initial="hidden" animate="visible"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <Image src="/icon.png" alt="BistroPulse Logo" width={32} height={32} priority />
                        <h1 className="text-xl ml-2 font-bold text-blue-500">BistroPulse</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* --- Language Dropdown Container --- */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                title='Change Language'
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
                                        <button onClick={() => handleLanguageSelect('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">English</button>
                                        <button onClick={() => handleLanguageSelect('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">French</button>
                                        <button onClick={() => handleLanguageSelect('sw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Kiswahili</button>
                                        <button onClick={() => handleLanguageSelect('rw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Kinyarwanda</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { router.push('/admin/profile'); }}>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">DS</div>
                        </div>
                        <button title='Toggle Menu' onClick={toggleSidebar} className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300">
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
                                    <button title='Close Menu' onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>
                                {sidebarContent}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <motion.aside
                    className="hidden md:flex w-64 bg-white text-gray-500 p-4 flex-col dark:bg-gray-950"
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
                            <LanguageProvider>{children}</LanguageProvider>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}