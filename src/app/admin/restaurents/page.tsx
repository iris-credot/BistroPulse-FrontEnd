"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical,  Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from "../../../../components/Button"; // Assuming you have these components
import { Input } from "../../../../components/Input";
import toast from "react-hot-toast";

// --- Step 1: Define the shape of the data coming from your API ---
interface RestaurantFromAPI {
  _id: string; // MongoDB uses _id
  name: string;
  owner?: {
    user?: {
      names?: string;
      username?: string;
    };
  };
  location?: string;
  phone?: string;
  averageRating?: number;
  status?: "Open" | "Closed";
  // Add any other fields your API sends
}

// --- Step 2: Define the shape of the data your component will use ---
type Restaurant = {
  id: string; // Use string for MongoDB _id
  name: string;
  representative: string;
  location: string;
  phone: string;
  rating: number;
  status: "Open" | "Closed";
};

export default function RestaurantTable() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/restaurant", {
          method: 'GET', // Use GET to fetch a list of resources
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
       
          throw new Error(errorData.message || "Failed to fetch restaurants.");
        }

        const data = await response.json();
   console.log(data);
        if (!data.restaurants || !Array.isArray(data.restaurants)) {
            throw new Error("API response is missing the 'restaurants' array.");
        }
        
        // --- Step 3: Transform the API data into the shape your UI needs ---
        const transformedRestaurants: Restaurant[] = data.restaurants.map((rest: RestaurantFromAPI) => ({
          id: rest._id,
          name: rest.name,
          representative: rest.owner?.user?.names || rest.owner?.user?.username || 'N/A',
          location: rest.location || 'N/A',
          phone: rest.phone || 'N/A',
          rating: rest.averageRating || 0,
          status: rest.status || "Closed",
        }));

        setRestaurants(transformedRestaurants);

      } catch (err) {
       
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(rest =>
    rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rest.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rest.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (restaurantId: string, restaurantName: string) => {
    if (window.confirm(`Are you sure you want to delete ${restaurantName}?`)) {
        // Optimistic UI update
        setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        setSelectedMenuId(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://bistroupulse-backend.onrender.com/api/restaurant/${restaurantId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to delete restaurant.");
            }
            toast.success("Restaurant deleted successfully.");
        } catch (err) {
           console.log(err);
            // Revert UI on error by re-fetching data
            // (A more advanced implementation would not need to re-fetch)
            // For now, a reload is a simple way to reset state
            window.location.reload(); 
        }
    }
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button className="border px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center">
            <Filter size={18} /> Filter
          </Button>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto justify-center" onClick={() => router.push('/admin/add-restaurent')}>
            Add Restaurant
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="p-3"><input type="checkbox" aria-label="Select all restaurants" /></th>
              <th className="p-3">Name</th>
              <th className="p-3">Representative</th>
              <th className="p-3">Location</th>
              <th className="p-3">Phone Number</th>
           
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={8} className="text-center p-4">Loading restaurants...</td></tr>
            ) : error ? (
                <tr><td colSpan={8} className="text-center p-4 text-red-500">{error}</td></tr>
            ) : filteredRestaurants.map((rest) => (
              <tr key={rest.id} className="hover:bg-gray-50 border-b text-sm">
                <td className="p-3"><input type="checkbox" aria-label={`Select ${rest.name}`} /></td>
                <td className="p-3 font-medium">{rest.name}</td>
                <td className="p-3">{rest.representative}</td>
                <td className="p-3">{rest.location}</td>
                <td className="p-3">{rest.phone}</td>
               
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ rest.status === 'Open' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100' }`}>
                    {rest.status}
                  </span>
                </td>
                <td className="p-3 relative">
                  <Button onClick={() => setSelectedMenuId(selectedMenuId === rest.id ? null : rest.id)} aria-label="More actions" className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={18} />
                  </Button>
                  {selectedMenuId === rest.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md text-sm z-10">
                      <button onClick={() => router.push(`/admin/view-restaurent/${rest.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <Eye size={16} /> View
                      </button>
                      <button onClick={() => router.push(`/admin/edit-restaurent/${rest.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(rest.id, rest.name)} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* You can add pagination logic here if needed */}
    </div>
  );
}