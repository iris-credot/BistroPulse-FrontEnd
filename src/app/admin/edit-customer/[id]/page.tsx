'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import toast from 'react-hot-toast';
import { Button } from '../../../../../components/Button';
import { Input } from '../../../../../components/Input';
import { Customer } from "../../../../../types/customer";
import { OwnerFromAPI } from "../../../../../types/owner";
import LoadingSpinner from "../../../../../components/loadingSpinner";

interface UpdatePayload {
  user: {
    names: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  businessName: string;
}

const EditCustomerPage = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No customer ID found in URL.");
      return;
    }

    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("You are not authenticated.");

        const response = await fetch(`${apiBaseUrl}/owner/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Customer not found.");
          throw new Error("Failed to fetch customer data.");
        }

        const data = await response.json();
        const owner: OwnerFromAPI = data.owner;

        setFormData({
          id: owner._id,
          names: owner.user?.names || '',
          email: owner.user?.email || '',
          phoneNumber: owner.user?.phoneNumber || '',
          address: owner.user?.address || '',
          avatar: owner.user?.image || "/images/default-avatar.png",
          restaurant: owner.businessName || '',
          created: '', 
          orders: [],
          status: '',
          category: ''
        });

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [apiBaseUrl,id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

 const handleSave = async () => {
    if (!formData) {
      toast.error("Form data is not available.");
      return;
    }
    setIsSaving(true);
    
    const payload: UpdatePayload = {
      user: {
        names: formData.names ?? '',
        email: formData.email ?? '',
        phoneNumber: formData.phoneNumber ?? '',
        address: formData.address ?? '',
      },
      businessName: formData.restaurant ?? '',
    };

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("You are not authenticated.");

        const response = await fetch(`${apiBaseUrl}/owner/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save changes.");
        }

        toast.success("Profile updated successfully!");
        router.push('/admin/customer-list');

    } catch (err) {
        console.error("Save failed:", err);
    } finally {
        setIsSaving(false);
    }
  };

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!formData) {
    return <div className="text-center p-10">Could not load customer data.</div>;
  }

  return (
    // Added responsive padding
    <div className="p-4 sm:p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center dark:text-white">Edit Owner Profile</h2>
      
      {/* Added responsive padding to card */}
      <div className="w-full bg-white p-6 sm:p-8 rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={formData.avatar}
            alt="Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Name</label>
            <Input
              type="text"
              name="names"
              value={formData.names}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Phone</label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Address</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Business Name</label>
            <Input
              type="text"
              name="restaurant"
              value={formData.restaurant}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          
          {/* Buttons stack vertically on mobile, horizontally on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
             <Button
                onClick={() => router.back()}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                disabled={isSaving}
             >
                Cancel
            </Button>
            <Button
                onClick={handleSave}
                // Added flex and justify-center to center the spinner
                className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
            >
                {isSaving ? <LoadingSpinner /> : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;