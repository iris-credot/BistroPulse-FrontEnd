"use client";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { AvatarUploader } from '../../../../components/AvatarUploader';
import React, { useState } from "react";

import {Customer} from '../../../../types/customer'


interface AddCustomerProps {
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose, onAddCustomer }) => {
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



 

  const handleAddCustomer = () => {
    const newCust = { 
      ...newCustomer, 
      id: Math.floor(Math.random() * 10000), 
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      orders: [],
      status: "Active",
      category: "Regular"
    };
    onAddCustomer(newCust);
    onClose();
  };

  return (
    <div className="  bg-opacity-50 flex items-center justify-center z-50 h-screen p-7">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg ">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Add New Customer</h2>
        <div className="flex flex-col items-center mb-6">
           <AvatarUploader 
        initialAvatar={newCustomer.avatar}
        onAvatarChange={(avatar) => setNewCustomer({...newCustomer, avatar})}
      />
        
        
        </div>
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter email"
              aria-label="Customer email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter phone"
              aria-label="Customer phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <Input
              type="text"
              name="location"
              value={newCustomer.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter location"
              aria-label="Customer location"
            />
          </div>
          <Button 
            onClick={handleAddCustomer} 
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Add customer"
          >
            Add Customer
          </Button>
          <Button
            onClick={onClose} 
            className="w-full mt-2 text-gray-600 hover:text-gray-800"
            aria-label="Cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;