'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Customer } from "../../../../types/customer";

const ViewCustomerPage = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        // In a real app, you would get the customer ID from the URL params
        // const customerId = router.query.id;
        
        // Mock customer data
        const mockCustomer: Customer = {
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
          ],
          // Additional fields from Customer type
       
          restaurant: "Cafe Delight",
       
          category: "VIP"
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomer(mockCustomer);
      } catch (err) {
        setError("Failed to load customer data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setCustomer(prev => prev ? {...prev, avatar: newAvatar} : null);
    }
  };

  const handleRemovePicture = () => {
    if (customer) {
      setCustomer({...customer, avatar: "/images/default-avatar.jpg"});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading customer profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <div className="bg-opacity-50 flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Customer Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
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
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                aria-label="Upload profile picture"
              />
              Upload
            </label>
            <Button
              onClick={handleRemovePicture}
              className="mt-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              aria-label="Remove profile picture"
            >
              Remove
            </Button>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.status || "N/A"}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <p className="mt-1 p-2 bg-gray-50 rounded-md">{customer.category || "N/A"}</p>
          </div>
          
        
          
          {customer.orders && customer.orders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Order History</h3>
              <div className="overflow-x-auto">
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
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => router.push('/owner/customer-list')}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Back to List
        </Button>
        <Button
          onClick={() => router.push(`/owner/edit-customer/${customer.id}`)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ViewCustomerPage;