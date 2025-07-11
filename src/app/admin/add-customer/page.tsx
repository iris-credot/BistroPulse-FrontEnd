"use client";

import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { AvatarUploader } from '../../../../components/AvatarUploader';
import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function AddCustomerPage() {
  const router = useRouter();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    universityStatus: "University student",
    university: "",
    restaurant: "",
    email: "",
    phone: "",
    gender: "Male",
    location: "",
    avatar: "/images/profile.jpg",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async () => {
  
    try {
      // Here you would typically make an API call to your backend
      // Example:
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   body: JSON.stringify(newCust)
      // });
      
      // For now, we'll just redirect back
      router.push('/admin/customer-list');
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50 h-screen p-7">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Add New Customer</h2>
        <div className="flex flex-col items-center mb-6">
          <AvatarUploader 
            initialAvatar={newCustomer.avatar}
            onAvatarChange={(avatar) => setNewCustomer({...newCustomer, avatar})}
          />
        </div>
        <div className="space-y-4">
          {/* Rest of your form inputs remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter name"
              aria-label="Customer name"
            />
          </div>
          {/* Other input fields... */}
          <Button 
            onClick={handleAddCustomer} 
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Add customer"
          >
            Add Customer
          </Button>
          <Button
            onClick={() => router.push('/admin/customer-list')}
            className="w-full mt-2 text-gray-600 hover:text-gray-800"
            aria-label="Cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}