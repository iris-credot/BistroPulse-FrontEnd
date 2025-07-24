"use client";

import React, { useState, useEffect } from "react";
// --- REMOVED 'Filter' as it's no longer used ---
import { Search, Plus, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import LoadingSpinner from "../../../../components/loadingSpinner";
import toast from "react-hot-toast";

// Interface for the restaurant data displayed in the component
interface Restaurant {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    city?: string;
  };
  image: string;
}

// --- NEW: Interface for the raw data coming from the API ---
// This resolves the 'any' type error.
interface RestaurantFromAPI {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
        state?: string;
        zipCode?: string;
    };
    image?: string;
}


const RestaurantList = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- REMOVED: Unused filter state ---
  // const [filterVisible, setFilterVisible] = useState(false);
  // const [filters, setFilters] = useState({...});

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOwnerAndRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          throw new Error("Authentication failed. Please log in again.");
        }
        
        const user = JSON.parse(storedUser);
        const userId = user?._id;

        if (!userId) {
          throw new Error("User ID not found in your session.");
        }

        const ownerResponse = await fetch(`${apiBaseUrl}/owner/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!ownerResponse.ok) throw new Error("Could not fetch your owner profile.");
        
        const ownerData = await ownerResponse.json();
        const ownerId = ownerData.owner?._id;
console.log(ownerId)
        if (!ownerId) throw new Error("Could not identify the owner ID for your profile.");

        const restaurantsResponse = await fetch(`${apiBaseUrl}/owner/${ownerId}/restaurants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!restaurantsResponse.ok) throw new Error("Failed to fetch restaurants.");

        // --- TYPED: Use the RestaurantFromAPI interface here ---
        const data: { restaurants: RestaurantFromAPI[] } = await restaurantsResponse.json();

        // --- THE FIX: Use the specific interface instead of 'any' ---
        const transformedRestaurants: Restaurant[] = data.restaurants.map((rest: RestaurantFromAPI) => ({
          id: rest._id,
          name: rest.name,
          email: rest.email,
          phone: rest.phone || 'N/A',
          address: { city: rest.address?.city || 'N/A' },
          image: rest.image || '/images/default-restaurant.png',
        }));

        setRestaurants(transformedRestaurants);

      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerAndRestaurants();
  }, [apiBaseUrl]);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.address.city && restaurant.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  
  const handleSelectAll = (checked: boolean) => {
    setSelectedRestaurants(checked ? currentItems.map(r => r.id) : []);
  };

  const handleSelect = (restaurantId: string, checked: boolean) => {
    setSelectedRestaurants(prev =>
      checked ? [...prev, restaurantId] : prev.filter(id => id !== restaurantId)
    );
  };
  
  const toggleDropdown = (restaurantId: string) => {
    setActiveDropdown(prev => prev === restaurantId ? null : restaurantId);
  };

  const handleView = (id: string) => router.push(`/owner/view-restaurant/${id}`);
  const handleEdit = (id: string) => router.push(`/owner/edit-restaurant/${id}`);
  const handleAdd = () => router.push('/owner/add-restaurant');
  
  const handleDelete = async (restaurantId: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      const originalRestaurants = [...restaurants];
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/restaurant/${restaurantId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Delete failed.");
        toast.success("Restaurant deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete restaurant.");
        console.log(error);
        setRestaurants(originalRestaurants);
      } finally {
        setActiveDropdown(null);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Restaurants</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input type="text" placeholder="Search restaurants..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {/* --- REMOVED: Filter button --- */}
          <Button onClick={handleAdd} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Restaurant</span>
          </Button>
        </div>
      </div>
      
      {/* --- REMOVED: The entire filter dropdown UI block --- */}

      <div className="overflow-x-auto mt-4">
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>
        ) : currentItems.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="p-4"><input title="j" type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} /></th>
                <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Name</th>
                <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Email</th>
                <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Phone</th>
                <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Location</th>
                <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rest) => (
                <tr key={rest.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4"><input title="h" type="checkbox" checked={selectedRestaurants.includes(rest.id)} onChange={(e) => handleSelect(rest.id, e.target.checked)} /></td>
                  <td className="p-4 flex items-center gap-3">
                    <Image src={rest.image} alt={rest.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{rest.name}</span>
                  </td>
                  <td className="p-4 text-sm text-blue-600">{rest.email}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{rest.phone}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{rest.address.city}</td>
                  <td className="p-4 relative">
                    <Button onClick={() => toggleDropdown(rest.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </Button>
                    {activeDropdown === rest.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <Button onClick={() => handleView(rest.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Eye className="w-4 h-4" /> View</Button>
                        <Button onClick={() => handleEdit(rest.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Edit className="w-4 h-4" /> Edit</Button>
                        <Button onClick={() => handleDelete(rest.id)} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 flex items-center gap-2 dark:hover:bg-red-900/40"><Trash2 className="w-4 h-4" /> Delete</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">You have not added any restaurants yet.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRestaurants.length)} of {filteredRestaurants.length} restaurants
          </span>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</Button>
            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;