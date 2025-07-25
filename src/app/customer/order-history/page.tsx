"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loadingSpinner";
import { MapPin, Phone, Save } from 'lucide-react'; // Relevant icons

// Define the shape of the user data (can be simplified if only address is needed)
interface UserFromAPI {
  _id: string;
  address?: string;
  phoneNumber?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export default function AddressSettingsPage() {
  const router = useRouter();
  
  // Component state, focused on address details
  const [user, setUser] = useState<UserFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to fetch initial user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          toast.error("Authentication required. Redirecting to login.");
          router.push('/login');
          return;
        }

        // Fetch only the data needed for this page
        const response = await fetch(`${API_BASE_URL}/api/user/getOne/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch your information.");
        }

        const data = await response.json();
        setUser(data.user || data);
        
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Handler for input changes (can handle both input and textarea)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const toastId = toast.loading("Updating your address...");

    // We only need to send the fields that can be updated on this page
    const payload = {
      address: user.address || '',
      phoneNumber: user.phoneNumber || ''
    };
    
    try {
      const token = localStorage.getItem('token');
      if (!user._id) throw new Error("User ID is missing.");

      const response = await fetch(`${API_BASE_URL}/api/user/profile/${user._id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Use JSON since we are not sending files
        },
        body: JSON.stringify(payload), // Send as a JSON string
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update address.");
      }
      
      toast.success("Address updated successfully!", { id: toastId });

    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"><LoadingSpinner /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400"/>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Address</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Update your delivery and contact information.</p>
        </header>

        {error && !user ? (
            <div className="text-center p-4 text-red-600 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p>Could not load your information. Please try again later.</p>
                <p className="text-sm mt-1">({error})</p>
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <textarea
                            title="Address"
                            name="address"
                            value={user?.address || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 transition"
                            placeholder="e.g., 123 Flavor Street, Foodie City, 12345"
                        />
                    </div>
                </div>

                {/* Phone Number Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            title="Phone Number"
                            type="tel"
                            name="phoneNumber"
                            value={user?.phoneNumber || ''}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 transition"
                            placeholder="e.g., (555) 123-4567"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                        disabled={saving || !user}
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}