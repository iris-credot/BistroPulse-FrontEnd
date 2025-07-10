'use client';

import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../../components/Button';


export default function MyAddresses() {
  // Sample address data
  const addresses = [
    {
      id: 1,
      title: 'Home',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Work',
      address: '456 Business Ave, Floor 12, New York, NY 10005',
      isDefault: false,
    },
    {
      id: 3,
      title: 'Mom\'s House',
      address: '789 Family Lane, Brooklyn, NY 11201',
      isDefault: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <Link 
          href="/customer/add-address" 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MapPin className="text-blue-500" size={18} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{address.title}</h3>
                  {address.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1 text-sm">{address.address}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500">
                <Edit size={16} />
                Edit
              </Button>
              {!address.isDefault && (
                <Button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500">
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
              {!address.isDefault && (
                <Button className="ml-auto text-sm text-blue-500 hover:text-blue-700">
                  Set as Default
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {/* {addresses.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No saved addresses</h3>
          <p className="text-gray-500 mt-1">Add your first address to get started</p>
          <Link 
            href="/customer/addresses/add" 
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 transition-colors"
          >
            <Plus size={18} />
            Add Address
          </Link>
        </div>
      )} */}
    </div>
  );
}