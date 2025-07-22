'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import Image from "next/image";
import { Button } from '../../../../../components/Button';
import { Customer } from "../../../../../types/customer";
import { format } from 'date-fns';
import LoadingSpinner from '../../../../../components/loadingSpinner';
import { OwnerFromAPI } from '../../../../../types/owner';
// Define the shape of the owner object coming from your single-owner API endpoint


const ViewCustomerPage = () => {
  const router = useRouter();
  const params = useParams(); // Hook to get URL parameters
  const id = params.id as string; // Get the specific ID, e.g., '6876619c153b780ad46c14ab'

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run the fetch function if an ID is present in the URL
    if (!id) {
        setLoading(false);
        setError("No customer ID provided in the URL.");
        return;
    }

    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); // Safe to access localStorage here

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/owner/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Customer not found.");
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch customer data');
        }

        const data = await response.json();

        if (!data || !data.owner) {
            throw new Error("Customer data is missing in the API response.");
        }

        const owner: OwnerFromAPI = data.owner;

        // Transform the fetched owner data into the Customer type for the UI
        const transformedCustomer: Customer = {
            id: owner._id,
            names: owner.user?.names || owner.user?.username || owner.user?.email || 'N/A',
            phoneNumber: owner.user?.phoneNumber || 'N/A',
            email: owner.user?.email || 'N/A',
            address: owner.user?.address || 'N/A',
            created: format(new Date(owner.createdAt), 'MMM dd, yyyy'),
            avatar: owner.user?.image || "/images/default-avatar.png", // Ensure this fallback image exists in your /public folder
            status: owner.user?.verified ? "Active" : "Pending",
            orders: [], // You can map real order data here if the API provides it
            restaurant: owner.businessName || 'N/A',
            category: "Regular" // You can set this based on some logic if needed
        };
        
        setCustomer(transformedCustomer);

      } catch (err) {
      
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]); // Re-run the effect if the ID in the URL changes

 if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 mb-4 text-lg">{error}</p>
        <Button 
          onClick={() => router.push('/admin/customer-list')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to List
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Customer profile could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-opacity-50 flex flex-col items-center justify-center  max-h-screen p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center dark:text-white">Representative Information.</h2>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
        <div className="flex-shrink-0 text-center">
          <Image
            src={customer.avatar}
            alt={customer.names || "Customer profile"}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
            priority
         
          />
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Name</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.names}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Email Address</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Phone</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.phoneNumber}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Business Name</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.restaurant}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Location</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Account Created</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.created}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Status</label>
            <p className={`mt-1 p-2 font-semibold rounded-md ${customer.status === 'Active' ? 'bg-gray-900  text-green-800' : 'bg-gray-900  text-yellow-800'}`}>
                {customer.status}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-white">Category</label>
            <p className="mt-1 p-2  bg-gray-900 text-white rounded-md">{customer.category}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <Button
          onClick={() => router.push('/admin/customer-list')}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Back to List
        </Button>
        <Button
          onClick={() => router.push(`/admin/edit-customer/${customer.id}`)}
          className="px-6 py-2 bg-blue-600 text-gray-800 rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ViewCustomerPage;