"use client";

import { MapPin, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../../components/Button';
import { useEffect, useState } from 'react';

// --- NEW: Interface for an address coming from the API ---
interface Address {
  _id: string;
  title: string;
  address: string;
  isDefault?: boolean;
}

export default function MyAddresses() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Function to fetch addresses from the API ---
  const fetchAddresses = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!storedUser || !token) {
        throw new Error("Authentication required. Please log in.");
      }
      const user = JSON.parse(storedUser);
      const userId = user?._id;
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const response = await fetch(`${apiBaseUrl}/user/getOne/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses.');
      }
      
      const data = await response.json();
      console.log(data);
      // Assuming the API returns a user object with an 'addresses' array
      setAddresses(data.user.addresses || []);

    } catch (err) {
      console.log(err);
        setError("Order ID not found in URL.");


    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Fetch addresses when the component mounts ---
  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- NEW: Function to handle deleting an address ---
  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/user/address/${addressId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete address.');
        
        // Refresh the list after deleting
        fetchAddresses(); 
    } catch (err) {
        console.log(err)
    }
  };

  // --- NEW: Function to set an address as default ---
  const handleSetDefault = async (addressId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/user/address/default/${addressId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to set as default.');
        
        // Refresh the list to show the change
        fetchAddresses();
    } catch (err) {
       console.log(err)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-2 dark:text-white">Loading addresses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300">Error</h3>
        <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Addresses</h1>
        <Link 
          href="/customer/add-address" 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </Link>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address._id} 
              className={`border rounded-lg p-4 flex flex-col justify-between ${
                address.isDefault 
                  ? 'border-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-blue-500' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mt-1">
                    <MapPin className="text-blue-500 dark:text-blue-400" size={18} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800 dark:text-white">{address.title}</h3>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{address.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t dark:border-gray-700">
                <Link
                  href={`/customer/edit-address/${address._id}`}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Edit size={16} />
                  Edit
                </Link>

                {!address.isDefault && (
                  <Button onClick={() => handleDelete(address._id)} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
                {!address.isDefault && (
                  <Button onClick={() => handleSetDefault(address._id)} className="ml-auto text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed dark:border-gray-700 rounded-lg">
          <MapPin size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No saved addresses</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add your first address to get started</p>
          <Link 
            href="/customer/add-address" 
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 transition-colors"
          >
            <Plus size={18} />
            Add Address
          </Link>
        </div>
      )}
    </div>
  );
}