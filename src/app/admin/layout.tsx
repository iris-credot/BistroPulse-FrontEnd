// src/app/admin/layout.tsx
"use client"; 
import React from 'react';
import axios from "axios";
import { LayoutDashboard, Utensils, Users, Bell, LogOut ,ShoppingCart, History} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { LanguageProvider } from '../../../components/LanguageProvider';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
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
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex justify-center items-center space-x-2">
             <Image 
                        src="/icon.png" 
                        alt="BistroPulse Logo" 
                        width={32}  
                        height={32} 
                       
                        priority // Added for above-the-fold image
                      />
                       <h1 className="text-xl  font-bold text-blue-500">BistroPulse</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button  title='dd' className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2" onClick={()=>{ router.push('/admin/settings');}}>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium" onClick={()=>{ router.push('/admin/settings');}}>
                DS
              </div>
              <span className="text-sm font-medium" onClick={()=>{ router.push('/admin/settings');}}>Darnell Steward</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white text-gray-500 p-4 flex flex-col">
          <div className="flex-1">
           
            <nav className='mt-4'>
              <ul className="space-y-3">
                <li>
                  <a href="/admin/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/restaurents" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <Utensils className="w-5 h-5" />
                    <span>Restaurants</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/customer-list" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <Users className="w-5 h-5" />
                    <span>Representatives</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/users" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Users</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/food-menu" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <Utensils className="w-5 h-5" />
                    <span> Menu</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/settings" className="flex items-center space-x-3 px-3 py-2 rounded hover:text-gray-800">
                    <History className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <ul className="space-y-1">
             
              <li onClick={handleLogout}>
                <a  className="flex items-center space-x-3 px-3 py-2 rounded hover:text-red-950 text-red-400">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
         <LanguageProvider>{children}</LanguageProvider>
        </main>
      </div>
    </div>
  );
}