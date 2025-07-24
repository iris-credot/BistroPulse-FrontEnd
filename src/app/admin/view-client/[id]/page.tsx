'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";
import { Button } from '../../../../../components/Button';
import { Customer } from "../../../../../types/customer";
import { format } from 'date-fns';
import LoadingSpinner from '../../../../../components/loadingSpinner';
// Define the shape of a single user object coming from your /api/user/getOne endpoint
interface UserFromAPI {
  _id: string;
  names?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
  createdAt: string;
  verified?: boolean;
}

const ViewCustomerPage = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setLoading(false);
        setError("No user ID provided in the URL.");
        return;
    }

    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(`${apiBaseUrl}/user/getOne/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error("User not found.");
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        
        // --- FIX 1: Check for 'data.user' instead of 'data.owner' ---
        if (!data || !data.user) {
            throw new Error("User data is missing in the API response.");
        }

        const user: UserFromAPI = data.user;

        // --- FIX 2: Transform the 'user' object ---
        // This is a client user, so 'restaurant' is not applicable.
        const transformedCustomer: Customer = {
            id: user._id,
            names: user.names || user.username || user.email || 'N/A',
            phoneNumber: user.phoneNumber || 'N/A',
            email: user.email || 'N/A',
            address: user.address || 'N/A',
            created: format(new Date(user.createdAt), 'MMM dd, yyyy'),
            avatar: user.image || "/images/default-avatar.png",
            status: user.verified ? "Active" : "Pending",
            orders: [],
            restaurant: 'N/A', // Client users don't have a business name
            category: "Regular"
        };
        
        setCustomer(transformedCustomer);

      } catch (err) {
       
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id,apiBaseUrl]);

 if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 mb-4 text-lg">{error}</p>
        <Button 
          onClick={() => router.push('/admin/customer-list')} // Navigate to the correct list
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Client List
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">User profile could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-opacity-50 flex flex-col items-center justify-center max-h-screen p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center dark:text-white">Client User Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex-shrink-0 text-center">
          <Image
            src={customer.avatar}
            alt={customer.names || "User profile"}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
            priority
           
          />
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Name</label>
            <p className="mt-1 p-2 text-gray-800 bg-gray-50 rounded-md dark:text-white dark:bg-gray-900">{customer.names}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Email Address</label>
            <p className="mt-1 p-2 text-gray-800 bg-gray-50 rounded-md dark:text-white dark:bg-gray-900">{customer.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Phone</label>
            <p className="mt-1 p-2 text-gray-800 bg-gray-50 rounded-md dark:text-white dark:bg-gray-900">{customer.phoneNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Location</label>
            <p className="mt-1 p-2 text-gray-800 bg-gray-50 rounded-md dark:text-white dark:bg-gray-900">{customer.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Account Created</label>
            <p className="mt-1 p-2 text-gray-800 bg-gray-50 rounded-md dark:text-white dark:bg-gray-900">{customer.created}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Status</label>
            <p className={`mt-1 p-2 font-semibold dark:text-white dark:bg-gray-900 rounded-md ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {customer.status}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <Button
          onClick={() => router.push('/admin/users')} // Navigate to the correct list page
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Back to List
        </Button>
        <Button
          onClick={() => router.push(`/admin/edit-client/${customer.id}`)} // Use a consistent route like /edit-user/
          className="px-6 py-2 bg-blue-600 text-gray-800  rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ViewCustomerPage;