"use client";
import { useState } from "react";
import { MoreVertical, Star } from "lucide-react";
import { useRouter } from 'next/navigation';

type Restaurant = {
  name: string;
  representative: string;
  location: string;
  phone: string;
  rating: number;
  status: "Open" | "Closed";
};

const restaurants: Restaurant[] = [
  {
    name: "Sun valley restaurant",
    representative: "Darrell Steward",
    location: "Aueduase",
    phone: "(406) 555-0120",
    rating: 4.8,
    status: "Open",
  },
    {
    name: "Boutique Hotel",
    representative: "Auderite Agryt",
    location: "Kigali",
    phone: "(406) 555-0120",
    rating: 2.8,
    status: "Open",
  },
    {
    name: "Five Star Nicko",
    representative: "Iris Credot",
    location: "Kigali",
    phone: "(250) 555-0120",
    rating: 3.8,
    status: "Open",
  },
  // Add more restaurant objects as needed...
];

export default function RestaurantTable() {
  const router = useRouter();
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <div className="flex gap-2 items-center">
        
          <div className="relative">
            <label htmlFor="search" className="sr-only">Search Restaurants</label>
            <input
              id="search"
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1"
            />
          </div>
          <button className="border px-3 py-1 rounded">Filter</button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded"  onClick={() => router.push('/add-restaurent')}>Add Restaurant</button>
         
        </div>
      </div>

      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-2">
              <input type="checkbox" aria-label="Select all restaurants" />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Representative</th>
            <th className="p-2">Location</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Ratings</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((rest, index) => (
            <tr key={index} className="hover:bg-gray-50 border-b">
              <td className="p-2">
                <input type="checkbox" aria-label={`Select ${rest.name}`} />
              </td>
              <td className="p-2">{rest.name}</td>
              <td className="p-2">{rest.representative}</td>
              <td className="p-2">{rest.location}</td>
              <td className="p-2">{rest.phone}</td>
              <td className="p-2 flex items-center gap-1">
                <Star size={14} className="text-orange-500" />
                {rest.rating}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    rest.status === 'Open'
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {rest.status}
                </span>
              </td>
              <td className="p-2 relative">
                <button
                  onClick={() =>
                    setSelectedMenuIndex(selectedMenuIndex === index ? null : index)
                  }
                  aria-label="More actions"
                >
                  <MoreVertical size={18} />
                </button>
                {selectedMenuIndex === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded text-sm z-10">
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100"
                      onClick={() => router.push('/view-restaurent')}
                    >
                      View
                    </button>
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100"
                      onClick={() => router.push('/edit-restaurent')}
                    >
                      Edit
                    </button>
                    <button className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100">
                      Deactivate
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
