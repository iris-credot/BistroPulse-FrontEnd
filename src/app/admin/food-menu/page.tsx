"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Power, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from 'components/loadingSpinner';
// --- CHANGE 1: Updated the FoodItem interface to match the API response ---
// It now uses 'image' instead of 'imageUrl' and 'isAvailable' (boolean) instead of 'status' (string).
interface FoodItem {
  _id: string;
  name: string;
  image: string; // Formerly imageUrl
  category: string;
  price: number;
  isAvailable: boolean; // Formerly status
}

interface Restaurant {
  _id: string;
  name: string;
}

const FoodManagement = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // State for data fetching and selection
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  // State for loading and errors
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for UI controls
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: "",
    status: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const itemsPerPage = 5;

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
  });

  // Effect 1: Fetch all restaurants when the component mounts (No changes needed here)
  useEffect(() => {
    const fetchRestaurants = async () => {
      setRestaurantsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/restaurant`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants.');
        }
        const data = await response.json();
        setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
      } finally {
        setRestaurantsLoading(false);
      }
    };
    fetchRestaurants();
  }, [apiBaseUrl]);

  // Effect 2: Fetch menu items when a restaurant is selected (No changes needed here)
  useEffect(() => {
    if (!selectedRestaurantId) {
      setFoodItems([]);
      return;
    }
    const fetchMenu = async () => {
      setMenuLoading(true);
      setError(null);
      setActiveDropdown(null);
      try {
        const response = await fetch(`${apiBaseUrl}/menu/restaurant/${selectedRestaurantId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          if (response.status === 404) {
            setFoodItems([]);
            return;
          }
          throw new Error('Failed to fetch menu.');
        }
        const data = await response.json();
        // The key from the API is 'menuItems', not 'menus'. This was corrected from previous versions.
        setFoodItems(Array.isArray(data.menuItems) ? data.menuItems : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
        setFoodItems([]);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, [selectedRestaurantId,apiBaseUrl]);

  // --- CHANGE 2: Updated filtering logic to use 'isAvailable' ---
  // This correctly translates the boolean 'isAvailable' to the 'Active'/'Deactive' status for filtering.
  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category ? item.category === filters.category : true;
      
      const currentStatus = item.isAvailable ? 'Active' : 'Deactive';
      const matchesStatus = filters.status ? currentStatus === filters.status : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [foodItems, searchTerm, filters]);

  // Extract unique categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set(foodItems.map(item => item.category));
    return Array.from(categories);
  }, [foodItems]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const deleteItem = (id: string) => {
    setFoodItems(prevItems => prevItems.filter(item => item._id !== id));
    toast.success("Item deleted successfully (mock)");
    setActiveDropdown(null);
  };

  // --- CHANGE 3: Updated toggleStatus to flip the 'isAvailable' boolean ---
  const toggleStatus = (id: string) => {
    setFoodItems(prevItems => prevItems.map(item =>
      item._id === id
        ? { ...item, isAvailable: !item.isAvailable }
        : item
    ));
    setActiveDropdown(null);
  };
  
  // Note: A stray setActiveDropdown(null) call was removed from here.

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 min-h-screen">
      
      {/* Restaurant Selector */}
      <div className="max-w-xl mx-auto mb-8 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-2">Food Menu Management</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          {selectedRestaurantId ? "Viewing menu" : "Select a restaurant to begin"}
        </p>
        <label htmlFor="restaurant-select" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
          Select Restaurant
        </label>
        {restaurantsLoading ? (
          <div className="text-center p-3"><LoadingSpinner/></div>
        ) : (
          <select
            id="restaurant-select"
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={restaurants.length === 0}
          >
            <option value="" disabled>{restaurants.length > 0 ? "Select a restaurant..." : "No restaurants found"}</option>
            {restaurants.map((restaurant) => (<option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>))}
          </select>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {selectedRestaurantId && (
        <>
          {/* Search and Filter Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu Items</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input type="text" placeholder="Search menu items..." title="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:text-white" aria-label="Search menu items" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Filter">
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter UI */}
          {filterVisible && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Category</label>
                  <select name="category" title="Filter by category" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="mt-1 block w-full border text-gray-700 dark:text-white border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600">
                    <option value="">All Categories</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Status</label>
                  <select name="status" title="Filter by status" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="mt-1 block w-full text-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600">
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={() => setFilters({ category: "", status: "" })} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md w-full">Clear</Button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Table */}
          {menuLoading ? (
            <div className="text-center p-10"><LoadingSpinner/></div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">No menu items match your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Name</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Image</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Category</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Price</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="p-4 text-sm font-medium text-gray-800 dark:text-white">{item.name}</td>
                      {/* --- CHANGE 4: Using 'item.image' for the Image src --- */}
                      <td className="p-4">
                        <div className="w-16 h-16 relative">
                          <Image src={item.image || '/default-food.png'} alt={item.name} fill sizes="64px" className="object-cover rounded" />
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">${item.price.toFixed(2)}</td>
                      {/* --- CHANGE 5: Corrected Status display to use 'isAvailable' --- */}
                      {/* The duplicate status column was also removed. */}
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.isAvailable ? 'Active' : 'Deactive'}
                        </span>
                      </td>
                      <td className="p-4 relative">
                        <Button title='Actions' onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </Button>
                        {activeDropdown === item._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                            <Button onClick={() => router.push(`/admin/view-menu/${item._id}`)} className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"><Eye className="w-4 h-4" /> View</Button>
                            <Button onClick={() => router.push(`/admin/edit-menu/${item._id}`)} className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Button>
                            {/* --- CHANGE 6: Updated Activate/Deactivate button to use 'isAvailable' --- */}
                            <Button onClick={() => toggleStatus(item._id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                              <Power className="w-4 h-4" /> {item.isAvailable ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button onClick={() => deleteItem(item._id)} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-300">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items</span>
              <div className="flex gap-2">
                <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50">Previous</Button>
                <span className="px-3 py-1 text-gray-700 dark:text-white">{currentPage} of {totalPages}</span>
                <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50">Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodManagement;