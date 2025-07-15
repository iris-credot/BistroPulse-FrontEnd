'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import toast from 'react-hot-toast';
import { Button } from '../../../../../components/Button';
import { Input } from '../../../../../components/Input';
import { Customer } from "../../../../../types/customer";

// Define the shape of a single user from your API
interface UserFromAPI {
  _id: string;
  names?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
}

// Define the exact shape of the data for the PUT request
// This should only contain fields that can be updated for a user.
interface UpdateUserPayload {
  names: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const EditCustomerPage = () => {
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
      setError("No user ID found in URL.");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("You are not authenticated.");

        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/user/getOne/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("User not found.");
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        
        // --- FIX 1: Access 'data.user' which is what the API sends ---
        if (!data || !data.user) {
            throw new Error("User data is missing in the API response.");
        }
        const user: UserFromAPI = data.user;

        // Populate the form state with the fetched user data
        setFormData({
          id: user._id,
          names: user.names || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          avatar: user.image || "/images/default-avatar.png",
          // These fields don't apply to a client user but are part of the Customer type
          restaurant: '', 
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

    fetchUserData();
  }, [id]);

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
    
    // --- FIX 2: Create a payload with ONLY user fields ---
    // The backend endpoint for updating a user only needs user data.
    const payload: UpdateUserPayload = {
        names: formData.names ?? '',
        email: formData.email ?? '',
        phoneNumber: formData.phoneNumber ?? '',
        address: formData.address ?? '',
    };

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("You are not authenticated.");

        // --- FIX 3: Use the correct endpoint for updating a user ---
        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/user/profile/${id}`, {
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
        router.push('/admin/users'); // Navigate back to the client list

    } catch (err) {
       
        console.error("Save failed:", err);
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!formData) {
    return <div className="text-center p-10">Could not load user data.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Client Profile</h2>
      
      <div className="w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={formData.avatar}
            alt="Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-200"
          
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              name="names"
              value={formData.names}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          {/* Business Name field is removed as it does not apply to a client user */}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
             <Button
                onClick={() => router.back()}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isSaving}
             >
                Cancel
            </Button>
            <Button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;