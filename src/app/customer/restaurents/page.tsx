"use client";
import { Star } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
// NOTE: You would normally fetch this data from an API
// import React, { useState, useEffect } from "react";
// import { Restaurant } from "../../../../types/restaurant";

// --- Step 1: Use a consistent and realistic data structure ---
// Each object has a unique ID for routing.
const restaurants = [
  {
    id: "68769aa6ebb86e2c710b2f67",
    name: "Green Bites",
    representative: {
      id: "6876619c153b780ad46c14ab",
      name: "Darrell Steward",
    },
    location: "Kigali, Rwanda",
    phone: "+1 503 123 4567",
    rating: "4.8",
  },
  {
    id: "a2b3c4d5e6f7g8h9i0j1k2l3",
    name: "Boutique Hotel",
    representative: {
      id: "b3c4d5e6f7g8h9i0j1k2l3m4",
      name: "Auderite Agryt",
    },
    location: "Kigali, Rwanda",
    phone: "(406) 555-0120",
    rating: "4.2",
  },
  {
    id: "x5y6z7a8b9c0d1e2f3g4h5i6",
    name: "Five Star Nicko",
    representative: {
      id: "y6z7a8b9c0d1e2f3g4h5i6j7",
      name: "Iris Credot",
    },
    location: "Kigali, Rwanda",
    phone: "(250) 555-0120",
    rating: "3.8",
  },
];

export default function RestaurantTable() {
  const router = useRouter();

  // For a real application, you would fetch data like this:
  // const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     const response = await fetch('/api/restaurants'); // Your API endpoint
  //     const data = await response.json();
  //     setRestaurants(data);
  //   };
  //   fetchRestaurants();
  // }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <div className="flex gap-2 items-center">
          <Input type="text" placeholder="Search" className="border rounded px-3 py-1" />
          <Button className="border px-3 py-1 rounded">Filter</Button>
        </div>
      </div>

      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-2"><input title="h" type="checkbox" /></th>
            <th className="p-2">Restaurant Name</th>
            <th className="p-2">Representative</th>
            <th className="p-2">Location</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Ratings</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* --- Step 2: Map over the corrected data structure --- */}
          {restaurants.map((rest) => (
            <tr key={rest.id} className="hover:bg-gray-50 border-b">
              <td className="p-2"><input title="h" type="checkbox" /></td>
              <td className="p-2 font-medium">{rest.name}</td>
              <td 
                className="p-2 hover:underline text-blue-600 cursor-pointer"
                // --- Step 3: Implement correct dynamic routing for the agent ---
                onClick={() => router.push(`/admin/view-agentRestau/${rest.representative.id}`)}
              >
                {rest.representative.name}
              </td>
              <td className="p-2">{rest.location}</td>
              <td className="p-2">{rest.phone}</td>
              <td className="p-2 flex items-center gap-1">
                <Star size={14} className="text-orange-500 fill-current" />
                {rest.rating}
              </td>
              <td className="p-2">
                {/* --- Step 3: Implement correct dynamic routing for the restaurant --- */}
                <Link href={`/admin/view-restaurent/${rest.id}`}>
                  <FaEye 
                    className="text-gray-600 cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform" 
                    title="View restaurant overview"
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}