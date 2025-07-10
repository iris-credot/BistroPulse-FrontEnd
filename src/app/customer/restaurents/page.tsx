"use client";
import { Star } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Restaurant } from "../../../../types/restaurant";

const restaurants: Restaurant[] = [
  {
    restaurantName: "Sun valley restaurant",
    representativeName: "Darrell Steward",
    location: "Aueduase",
    phoneNumber: "(406) 555-0120",
    rating: "4.8",
   
  },
  {
   restaurantName: "Boutique Hotel",
   representativeName: "Auderite Agryt",
    location: "Kigali",
    phoneNumber: "(406) 555-0120",
    rating: "2.8",
    
  },
  {
   restaurantName: "Five Star Nicko",
   representativeName: "Iris Credot",
    location: "Kigali",
    phoneNumber: "(250) 555-0120",
    rating: "3.8",
   
  },
];

export default function RestaurantTable() {
  const router = useRouter();

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <label htmlFor="search" className="sr-only">Search Restaurants</label>
            <Input
              id="search"
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1"
            />
          </div>
          <Button className="border px-3 py-1 rounded">Filter</Button>
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
           
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((rest, index) => (
            <tr key={index} className="hover:bg-gray-50 border-b">
              <td className="p-2">
                <input type="checkbox" aria-label={`Select ${rest.restaurantName}`} />
              </td>
              <td className="p-2">{rest.restaurantName}</td>
              <td 
                className="p-2 hover:font-bold cursor-pointer" 
                onClick={() => {router.push('/admin/view-agentRestau')}}
              >
                {rest.representativeName}
              </td>
              <td className="p-2">{rest.location}</td>
              <td className="p-2">{rest.phoneNumber}</td>
              <td className="p-2 flex items-center gap-1">
                <Star size={14} className="text-orange-500" />
                {rest.rating}
              </td>
            
              <td className="p-2">
                <Link href="/customer/order-overview">
                  <FaEye 
                    className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" 
                    title="View orders"
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