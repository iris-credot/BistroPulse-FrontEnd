"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Type for Customer
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
};

// Props for EditCustomer
type EditCustomerProps = {
  customer: Customer;
  onSave: (updatedCustomer: Customer) => void;
  onClose: () => void;
};

const EditCustomer: React.FC<EditCustomerProps> = ({ customer, onSave, onClose }) => {
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (customer) setEditedCustomer(customer);
  }, [customer]);

  if (!editedCustomer) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow">Loading customer...</div>
      </div>
    );
  }

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedCustomer({ ...editedCustomer, [e.target.name]: e.target.value });
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedCustomer({ ...editedCustomer, avatar: URL.createObjectURL(file) });
    }
  };

  const handleRemoveEditPicture = () => {
    setEditedCustomer({ ...editedCustomer, avatar: "/images/profile.jpg" });
  };

  const handleSaveEdit = () => {
    if (editedCustomer) {
      onSave(editedCustomer);
    }
  };

  return (
    <div className="fixed inset-0 bg-white  flex-col bg-opacity-50 flex items-center justify-center z-50">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Edit Customer</h2>
        <div className="flex flex-col items-center mb-6">
          <Image
            src={editedCustomer.avatar || "/images/profile.jpg"}
            alt="Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-200"
          />
          <div className="flex gap-2">
            <label className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleEditFileUpload}
                className="hidden"
                aria-label="Upload profile picture"
              />
              Upload
            </label>
            <button
              onClick={handleRemoveEditPicture}
              className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              aria-label="Remove profile picture"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={editedCustomer.name}
              onChange={handleEditInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              aria-label="Customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editedCustomer.email}
              onChange={handleEditInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              aria-label="Customer email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={editedCustomer.phone}
              onChange={handleEditInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone"
              aria-label="Customer phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={editedCustomer.location}
              onChange={handleEditInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              aria-label="Customer location"
            />
          </div>
          <button
            onClick={handleSaveEdit}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Save changes"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 text-gray-600 hover:text-gray-800"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
     
    </div>
  );
};

// ---------- Static Preview Component ----------

const EditCustomerTest = () => {
  const dummyCustomer: Customer = {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+123456789",
    location: "New York, USA",
    avatar: "/images/profile.jpg", // default
  };

  const handleSave = (updatedCustomer: Customer) => {
    console.log("Saved customer:", updatedCustomer);
    alert("Customer saved! Check console for data.");
  };

  const handleClose = () => {
    console.log("Modal closed");
    alert("Edit modal closed.");
  };

  return <EditCustomer customer={dummyCustomer} onSave={handleSave} onClose={handleClose} />;
};

export default EditCustomerTest;
