"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import toast from "react-hot-toast";
import { OwnerFromAPI } from "types/owner";
import LoadingSpinner from "../../../../components/loadingSpinner";
interface Restaurant {
  id: string;
  owner:OwnerFromAPI;
  name: string;
  email: string;
  description: string;
    image: string;
  openingHours: string;
  representative: string;
  address: {
    street?: string;
    city?: string;
    country?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt:string;
  phone: string;
  rating: number; // Included for type safety
  status: "Open" | "Closed"; // Included for type safety
};
// Interface for the raw API response for a single restaurant
interface RestaurantFromAPI {
  _id: string;
  name: string;
  email: string;
  owner?: { user?: { names?: string; username?: string; }; };
  address?: { street?: string; city?: string; country?: string; state?: string; zipCode?: string; };
  phone?: string;
}

export default function RestaurantTable() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // --- STATE FOR FILTER VISIBILITY AND VALUES ---
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/restaurant", {
          method: 'GET',
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
        
        const transformedRestaurants: Restaurant[] = data.restaurants.map((rest: RestaurantFromAPI) => ({
          id: rest._id,
          name: rest.name,
          email:rest.email,
          representative: rest.owner?.user?.names || rest.owner?.user?.username || 'N/A',
          address: rest.address || { city: 'N/A' }, 
          phone: rest.phone || 'N/A',
        }));
        setRestaurants(transformedRestaurants);
      } catch (err) {
        console.log(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // --- UPDATED FILTER LOGIC ---
  const filteredRestaurants = restaurants.filter(rest => {
    const searchLower = searchTerm.toLowerCase();
    const filterNameLower = filters.name.toLowerCase();
    const filterLocationLower = filters.location.toLowerCase();

    const matchesSearch = searchTerm === "" ||
      rest.name.toLowerCase().includes(searchLower) ||
      rest.representative.toLowerCase().includes(searchLower);

    const matchesFilters = 
      (filters.name === "" || rest.name.toLowerCase().includes(filterNameLower)) &&
      (filters.location === "" || (rest.address?.city && rest.address.city.toLowerCase().includes(filterLocationLower)));

    return matchesSearch && matchesFilters;
  });

  // --- Reset to page 1 when filters change ---
  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, filters]);


  const handleDelete = async (restaurantId: string, restaurantName: string) => {
    if (window.confirm(`Are you sure you want to delete ${restaurantName}?`)) {
        const originalRestaurants = [...restaurants];
        setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        setSelectedMenuId(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://bistroupulse-backend.onrender.com/api/restaurant/${restaurantId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to delete restaurant.");
            toast.success("Restaurant deleted successfully.");
        } catch (err) {
          console.log(err);
           setRestaurants(originalRestaurants);
        }
    }
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - 1 <= halfMaxPages) endPage = Math.min(totalPages, maxPagesToShow);
    if (totalPages - currentPage < halfMaxPages) startPage = Math.max(1, totalPages - maxPagesToShow + 1);

    if (startPage > 1) {
        pageNumbers.push(<button key="1" onClick={() => setCurrentPage(1)} className="px-3 py-1 border border-gray-300 rounded dark:border-gray-600">1</button>);
        if (startPage > 2) pageNumbers.push(<span key="start-ellipsis" className="px-3 py-1">...</span>);
    }
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
                {i}
            </button>
        );
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(<span key="end-ellipsis" className="px-3 py-1">...</span>);
        pageNumbers.push(<button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 border border-gray-300 rounded dark:border-gray-600">{totalPages}</button>);
    }
    return pageNumbers;
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
         <div className="relative w-full sm:w-auto md:w-64">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
           <Input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
           />
         </div>
          <Button onClick={() => setFilterVisible(!filterVisible)} className="border px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center dark:border-gray-600 dark:hover:bg-gray-700">
            <Filter size={18} /> Filter
          </Button>
         
        </div>
      </div>
      
      {/* --- FILTER UI --- */}
      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 p-4 z-20 dark:border-gray-700">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Restaurant Name</label>
                    <Input type="text" name="name" value={filters.name} onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))} className="mt-1 w-full" placeholder="e.g. The Pizza Place"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Location (City)</label>
                    <Input type="text" name="location" value={filters.location} onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))} className="mt-1 w-full" placeholder="e.g. Kigali"/>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={() => setFilters({ name: "", location: "" })} className="px-4 py-2 text-white hover:bg-gray-100 dark:text-black dark:hover:bg-gray-800 rounded-md">Clear</Button>
                    <Button onClick={() => setFilterVisible(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</Button>
                </div>
            </div>
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10"><LoadingSpinner /></div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : filteredRestaurants.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentItems.map(rest => (
                
                <div key={rest.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2 relative border dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 dark:text-white">{rest.name}</p>
                        <Button onClick={() => setSelectedMenuId(selectedMenuId === rest.id ? null : rest.id)} aria-label="More actions" className="p-2 -mt-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <MoreVertical size={18} />
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Email:</strong> {rest.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Location:</strong> {rest.address?.city || 'N/A'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Phone:</strong> {rest.phone}</p>
                    {selectedMenuId === rest.id && (
                        <div className="absolute right-4 top-12 w-40 bg-white dark:bg-gray-700 border shadow-lg rounded-md text-sm z-10 dark:border-gray-600">
                            <button onClick={() => router.push(`/admin/view-restaurent/${rest.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"> <Eye size={16} /> View </button>
                            <button onClick={() => router.push(`/admin/edit-restaurent/${rest.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"> <Edit size={16} /> Edit </button>
                            <button onClick={() => handleDelete(rest.id, rest.name)} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 flex items-center gap-2"> <Trash2 size={16} /> Delete </button>
                        </div>
                    )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-50 text-sm dark:bg-gray-900">
                  <tr>
                    <th className="p-3"><input type="checkbox" aria-label="Select all restaurants" /></th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((rest) => (
                    <tr key={rest.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 text-sm">
                      <td className="p-3"><input type="checkbox" aria-label={`Select ${rest.name}`} /></td>
                      <td className="p-3 font-medium">{rest.name}</td>
                      <td className="p-3">{rest.email}</td>
                      <td className="p-3">{rest.address?.city || 'N/A'}</td>
                      <td className="p-3">{rest.phone}</td>
                      <td className="p-3 relative">
                        <Button onClick={() => setSelectedMenuId(selectedMenuId === rest.id ? null : rest.id)} aria-label="More actions" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <MoreVertical size={18} />
                        </Button>
                        {selectedMenuId === rest.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border shadow-lg rounded-md text-sm z-10 dark:border-gray-600">
                            <button onClick={() => router.push(`/customer/view-restaurant/${rest.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"> <Eye size={16} /> View </button>
                           
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center p-4 text-gray-500">No restaurants match your criteria.</div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRestaurants.length)} of {filteredRestaurants.length} restaurants
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 dark:border-gray-600">Previous</Button>
            {renderPagination()}
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 dark:border-gray-600">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}