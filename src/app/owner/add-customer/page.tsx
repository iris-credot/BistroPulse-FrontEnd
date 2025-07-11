"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';


const AddCustomerPage = () => {
  const router = useRouter();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    universityStatus: "University student",
    university: "",
    email: "",
    phone: "",
    gender: "Male",
    location: "",
    avatar: "/images/profile.jpg",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCustomer({ ...newCustomer, avatar: URL.createObjectURL(file) });
    }
  };

  const handleRemovePicture = () => {
    setNewCustomer({ ...newCustomer, avatar: "/images/profile.jpg" });
  };

  const handleAddCustomer = async () => {
    setLoading(true);
    setError("");
    
    try {
    

      // In a real app, you would make an API call here:
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(newCust)
      // });
      
      // if (!response.ok) throw new Error('Failed to add customer');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to customer list after successful creation
      router.push('/admin/customer-list');
    } catch (err) {
      console.error('Failed to add customer:', err);
      setError('Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50 min-h-screen p-7">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Add New Customer</h2>
        
        <div className="flex flex-col items-center mb-6">
          <Image
            src={newCustomer.avatar || "/images/profile.jpg"}
            alt="Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-200"
          />
          <div className="flex gap-2">
            <label className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
                aria-label="Upload profile picture"
              />
              Upload
            </label>
            <Button 
              onClick={handleRemovePicture} 
              className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              aria-label="Remove profile picture"
            >
              Remove
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              aria-label="Customer name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              aria-label="Customer email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone"
              aria-label="Customer phone"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <Input
              type="text"
              name="location"
              value={newCustomer.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              aria-label="Customer location"
              required
            />
          </div>
          
          {/* Additional fields for university */}
          <div>
            <label className="block text-sm font-medium text-gray-700">University Status</label>
            <select
            title="d"
              name="universityStatus"
              value={newCustomer.universityStatus}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="University student">University student</option>
              <option value="Graduate">Graduate</option>
              <option value="Not applicable">Not applicable</option>
            </select>
          </div>
          
          {newCustomer.universityStatus !== "Not applicable" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <Input
                type="text"
                name="university"
                value={newCustomer.university}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter university"
                aria-label="Customer university"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
            title="d"
              name="gender"
              value={newCustomer.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/admin/customer-list')}
              className="flex-1 mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={loading}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleAddCustomer} 
              className="flex-1 mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              aria-label="Add customer"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;