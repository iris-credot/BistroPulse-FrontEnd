"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Eye, Edit, UserMinus } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Customer } from "../../../../types/customer";
// This is the shape of the data the component will use for its state and UI


// This is the exact shape of a user object from your API
interface UserFromAPI {
  _id: string;
  names?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
  createdAt: string;
  verified?: boolean;
}

const CustomerList = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({ 
    location: "", 
    category: "", 
    status: "" 
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/user/allClients", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await response.json();
        
        // Transform the user data from the API into the Customer type for the UI
        const transformedCustomers: Customer[] = data.users.map((user: UserFromAPI) => ({
          id: user._id,
          name: user.names || user.username || user.email, // Use email as fallback for name
          email: user.email,
          phone: user.phoneNumber || 'N/A',
          location: user.address || 'N/A',
          avatar: user.image || "/images/default-avatar.png", // Ensure this fallback exists in /public
          created: format(new Date(user.createdAt), 'MMM dd, yyyy'),
          status: user.verified ? "Active" : "Pending",
          category: "Regular" // Default value
        }));

        setCustomers(transformedCustomers);

      } catch (err) {
       
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" ||
      (customer.names && customer.names.toLowerCase().includes(searchLower)) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchLower));

    const matchesFilters = 
      (filters.location === "" || customer.address === filters.location) &&
      (filters.category === "" || customer.category === filters.category) &&
      (filters.status === "" || customer.status === filters.status);
      
    return matchesSearch && matchesFilters;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

// Inside your CustomerList component

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/user/allClients", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await response.json();

        // --- THIS IS THE FIX ---
        // Access the array using the correct key: "clients" instead of "users".
        // Also, add a check to ensure the key exists before mapping.
        if (!data.clients || !Array.isArray(data.clients)) {
            throw new Error("API response is missing the 'clients' array.");
        }
        
        const transformedCustomers: Customer[] = data.clients.map((user: UserFromAPI) => ({
          id: user._id,
          names: user.names || user.username || 'N/A',
          email: user.email,
          phoneNumber: user.phoneNumber || 'N/A',
          address: user.address || 'N/A',
          avatar: user.image || "/images/default-avatar.png",
          created: format(new Date(user.createdAt), 'MMM dd, yyyy'),
          status: user.verified ? "Active" : "Pending",
          category: "Regular"
        }));

        setCustomers(transformedCustomers);

      } catch (err) {
        
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    setSelectedCustomers(checked ? currentCustomers.map(c => c.id) : []);
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    setSelectedCustomers(prev => 
      checked ? [...prev, customerId] : prev.filter(id => id !== customerId)
    );
  };

  const toggleDropdown = (customerId: string) => {
    setActiveDropdown(prev => prev === customerId ? null : customerId);
  };

  const handleViewProfile = (customerId: string) => {
    // Update this route if you have a specific view page for clients
    router.push(`/admin/view-client/${customerId}`);
  };

  const handleEditCustomer = (customerId: string) => {
    // Update this route if you have a specific edit page for clients
    router.push(`/admin/edit-client/${customerId}`);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const originalCustomers = [...customers];
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      
      try {
        const token = localStorage.getItem('token');
        // Assuming your delete endpoint is /api/user/:id
        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/user/${customerId}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Delete failed. Please try again.");
        }
        toast.success("User deleted successfully.");
      } catch (error) {
       console.log(error);
        setCustomers(originalCustomers); // Revert UI on error
      } finally {
        setActiveDropdown(null);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Client Users</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Location</label>
              <select
                name="location"
                title="Filter by user location"
                value={filters.location}
                // --- THIS IS THE FIX ---
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="mt-1 block w-full border text-gray-400 border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Nyamata">Nyamata</option>
                {/* Add other locations from your data */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <select
                name="category"
                title="Filter by user category"
                value={filters.category}
                // --- THIS IS THE FIX ---
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                title="Filter by user status"
                value={filters.status}
                // --- THIS IS THE FIX ---
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setFilters({ location: "", category: "", status: "" })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </Button>
              <Button
                onClick={() => setFilterVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}


      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4"><input title="s" type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} /></th>
              <th className="p-4 text-sm font-medium text-gray-700">Name</th>
              <th className="p-4 text-sm font-medium text-gray-700">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-700">Email</th>
              <th className="p-4 text-sm font-medium text-gray-700">Location</th>
              <th className="p-4 text-sm font-medium text-gray-700">Joined</th>
              <th className="p-4 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Loading users...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
            ) : currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-4"><input title="f" type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)} /></td>
                  <td className="p-4 flex items-center gap-3">
                    
                    <span className="text-sm font-medium text-gray-800">{customer.names}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.phoneNumber}</td>
                  <td className="p-4 text-sm text-blue-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.address}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.created}</td>
                  <td className="p-4 relative">
                    <Button onClick={() => toggleDropdown(customer.id)} className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </Button>
                    {activeDropdown === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                        <Button onClick={() => handleViewProfile(customer.id)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100">
                          <Eye className="w-4 h-4" /> View
                        </Button>
                        <Button onClick={() => handleEditCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100">
                          <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button onClick={() => handleDeleteCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-red-600 flex items-center gap-2 hover:bg-red-50">
                          <UserMinus className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No client users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-600">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} users</span>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</Button>
            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;