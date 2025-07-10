'use client';

import React from "react";
import Image from "next/image";
import { Button } from '../../../../components/Button';

import { Customer } from "../../../../types/customer";

interface ViewCustomerProps {
  customer?: Customer;
  onClose: () => void;
}

// ✅ Static fallback customer
const defaultCustomer: Customer = {
  id: 1,
  name: "Jane Doe",
  phone: "+1 555 123 4567",
  email: "jane.doe@example.com",
  location: "San Francisco, CA",
  created: "2025-07-08",
  avatar: "/images/default-avatar.jpg",
  status: "Active",
  orders: [
    { id: 101, details: "Order #101 - 3x T-Shirts", date: "2025-06-30", status: "Shipped" },
    { id: 102, details: "Order #102 - 2x Jeans", date: "2025-07-01", status: "Processing" }
  ]
};

const ViewCustomer: React.FC<ViewCustomerProps> = ({ customer = defaultCustomer, onClose }) => {
  return (
    <div className="  bg-opacity-50 flex flex-col items-center justify-center min-h-screen p-6 ">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Customer Profile</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Image
              src={customer.avatar || "/images/default-avatar.jpg"}
              alt={customer.name || "Customer profile"}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mx-auto md:mx-0"
              priority
            />
            <div className="mt-4 text-center md:text-left">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={() => {}}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
                Upload
              </label>
              <button
                onClick={() => {}}
                className="mt-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                aria-label="Remove profile picture"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.name || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.phone || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.email || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.location || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.created || "N/A"}</p>
            </div>
            {customer.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.status}</p>
              </div>
            )}
            {customer.orders && customer.orders.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order History</h3>
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-sm font-medium text-gray-700">Order ID</th>
                      <th className="p-2 text-sm font-medium text-gray-700">Details</th>
                      <th className="p-2 text-sm font-medium text-gray-700">Date</th>
                      <th className="p-2 text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="p-2 text-sm text-gray-600">{order.id}</td>
                        <td className="p-2 text-sm text-gray-600">{order.details || "N/A"}</td>
                        <td className="p-2 text-sm text-gray-600">{order.date || "N/A"}</td>
                        <td className="p-2 text-sm text-gray-600">{order.status || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={onClose}
          className=" mt-6 px-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          aria-label="Close profile"
        >
          Close
        </Button>
   
    </div>
  );
};

export default ViewCustomer;
