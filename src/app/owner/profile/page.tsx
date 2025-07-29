"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loadingSpinner";

// Define the shape of the user data
interface UserFromAPI {
  _id: string;
  names?: string;
  username?: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  image?: string;
}

// --- NEW: Centralized constants for clarity and maintenance ---
const DEFAULT_AVATAR = "/default-avatar.png";
const API_BASE_URL =process.env.NEXT_PUBLIC_API;

// --- NEW: Helper function to ensure the image URL is always valid ---
const getSafeImageUrl = (path?: string): string => {
  // If no path is provided, return the default avatar
  if (!path) {
    return DEFAULT_AVATAR;
  }
  // If the path is already a full URL (from Cloudinary) or a local blob URL, use it directly
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  // If it's a relative path from the backend, prepend the base API URL
  // This handles cases like "uploads/..."
  return `${API_BASE_URL}/${path}`;
};

export default function SettingsPage() {
  const router = useRouter();
  
  // Component state
  const [user, setUser] = useState<UserFromAPI | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        setImagePreview(getSafeImageUrl(userData.image));

      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
        // Fallback to default avatar on error
        setImagePreview(DEFAULT_AVATAR); 
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Handler for text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  // Handler for new profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // The blob URL is already a valid URL, so it works directly
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    const formData = new FormData();
    formData.append('names', user.names || '');
    formData.append('username', user.username || '');
    formData.append('address', user.address || '');
    formData.append('phoneNumber', user.phoneNumber || '');
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!user._id) throw new Error("User ID is missing.");

      const response = await fetch(`${API_BASE_URL}/api/user/profile/${user._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }
      
      const { user: updatedUser } = await response.json();
      
      // --- MODIFIED: Use the helper to process the URL from the update response ---
      setImagePreview(getSafeImageUrl(updatedUser.image));
      
      setImageFile(null);

      toast.success("Profile updated successfully!", { id: toastId });

    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // --- RENDER LOGIC (No changes needed here) ---

  if (loading) {
    return <div className="flex justify-center items-center h-screen dark:bg-gray-900"><LoadingSpinner /></div>;
  }

  if (error && !user) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col p-5 gap-6 dark:text-white items-center dark:bg-gray-900 min-h-screen">
      <h1 className="font-bold text-4xl md:text-5xl mt-8">Profile Settings</h1>

      <div className="w-full flex justify-center mb-4 mt-4">
        <div className="relative">
          {imagePreview && (
            <Image
              key={imagePreview}
              src={imagePreview}
              alt="Profile Picture"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
              unoptimized={imagePreview.startsWith('blob:')}
              onError={() => {
                setImagePreview(DEFAULT_AVATAR);
              }}
            />
          )}
          <input
            title="Upload profile image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profileImageUpload"
          />
          <label
            htmlFor="profileImageUpload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 dark:text-gray-800 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
          </label>
        </div>
      </div>

      <div className="bg-white w-full rounded-lg shadow-xl max-w-4xl p-6 md:p-8 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
          {/* Form inputs remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input title="Full Name" type="text" name="names" value={user?.names || ''} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input title="Username" type="text" name="username" value={user?.username || ''} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
              <input title="Email Address" type="email" name="email" value={user?.email || ''} readOnly className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 cursor-not-allowed"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input title="Phone Number" type="text" name="phoneNumber" value={user?.phoneNumber || ''} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input title="Address" type="text" name="address" value={user?.address || ''} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-blue-700 disabled:bg-blue-400" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="w-full max-w-4xl mt-4">
         <button onClick={() => router.push('/owner/update-password')} type="button" className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 w-full md:w-auto">
            Change Password
        </button>
      </div>
    </div>
  );
}