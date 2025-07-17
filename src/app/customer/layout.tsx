'use client';

import React from 'react';
import axios from "axios";
import { Home,Utensils, ShoppingCart, Heart, LogOut, MapPin,  Clock,  Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../../../components/darkTheme';
import { useRouter } from "next/navigation";
import { LanguageProvider } from '../../../components/LanguageProvider';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router= useRouter();
    const { darkMode, toggleDarkMode } = useTheme();
      const handleLogout = async () => {
  try {
   await axios.post(
  "https://bistroupulse-backend.onrender.com/api/user/logout",
  {},
  { withCredentials: true } // ✅ Add this
);
    // Clear localStorage tokens after successful logout
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Redirect or update UI after logout
     router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Failed to logout');
  }
};
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-sm z-10 dark:bg-gray-950">
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
            <button title="Notifications" className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button title="Favorites" className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2" onClick={()=>{ router.push('/admin/settings');}}>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium" onClick={()=>{ router.push('/admin/settings');}}>
                CU
              </div>
              <span className="text-sm font-medium" onClick={()=>{ router.push('/admin/settings');}}>Customer User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white text-gray-500 p-4 flex flex-col border-r border-gray-200 dark:bg-gray-950">
          <nav className="mt-4">
            <ul className="space-y-2">
              <li>
                <Link href="/customer/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded dark:hover:text-white hover:text-black">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/customer/restaurents" className="flex items-center space-x-3 px-3 py-2 rounded dark:hover:text-white hover:text-black">
                  <Utensils className="w-5 h-5" />
                  <span>Restaurants</span>
                </Link>
              </li>
              <li>
                <Link href="/customer/my-orders" className="flex items-center space-x-3 px-3 py-2 rounded dark:hover:text-white hover:text-black">
                  <ShoppingCart className="w-5 h-5" />
                  <span>My Orders</span>
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3</span>
                </Link>
              </li>
             
              <li>
                <Link href="/customer/my-addresses" className="flex items-center space-x-3 px-3 py-2 rounded dark:hover:text-white hover:text-black">
                  <MapPin className="w-5 h-5" />
                  <span>My Addresses</span>
                </Link>
              </li>
             
             
              <li>
                <Link href="/customer/order-history" className="flex items-center space-x-3 px-3 py-2 rounded dark:hover:text-white hover:text-black">
                  <Clock className="w-5 h-5" />
                  <span>Order History</span>
                </Link>
              </li>
             
            </ul>
          </nav>
    
 <div className="flex md:flex-row gap-12 w-full mb-3 justify-center items-center">
      <label className="  text-base font-semibold">
        DarkMode
      </label>
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`flex justify-center items-center   rounded-lg px-5 py-2 gap-3 border transition duration-300 ${
          darkMode
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-black border-black"
        }`}
      >
        <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
        <span>{darkMode ? "On" : "Off"}</span>
      </button>
    </div>
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <ul className="space-y-2">
            
           
              <li onClick={handleLogout}>
                <button className="flex items-center space-x-3 px-3 py-2 rounded text-red-400 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
          <LanguageProvider>{children}</LanguageProvider>
        </main>
      </div>
    </div>
  );
}