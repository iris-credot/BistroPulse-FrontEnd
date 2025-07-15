"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreVertical, Eye, Edit, UserMinus } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Customer } from '../../../../types/customer';
import { format } from 'date-fns';
import { OwnerFromAPI } from "../../../../types/owner";
// --- Step 1: Make the API type more accurate. BusinessName can be optional. ---


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
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/owner", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }

       const data = await response.json();
        const capitalize = (str: string) => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        // --- THIS IS THE CORRECTED TRANSFORMATION LOGIC ---
       const transformedCustomers: Customer[] = data.owners.map((owner: OwnerFromAPI) => {
  const phone = owner.user?.[" phoneNumber"] || owner.user?.phoneNumber || 'N/A';
  const rawName = owner.user?.names || owner.user?.username || owner.user?.email || 'N/A';
   const name = capitalize(rawName);
   const bus=owner.businessName || 'N/A';
     const org = capitalize(bus);

  return {
    id: owner._id,
    names: name,  // Changed from 'name'
    email: owner.user?.email || 'N/A',
    phoneNumber: phone,  // Changed from 'phone'
    restaurant: org,
    location: owner.user?.address || "Kigali",
            avatar: owner.user?.image || "", // Avatar is not used in the UI
            created: format(new Date(owner.createdAt), 'MMM dd, yyyy'),
            orders: [],
            status: owner.user?.verified ? "Active" : "Pending",
            category: "Regular"
          };
        });

        setCustomers(transformedCustomers);

      } catch (err) {
        
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  // --- Step 2: Make the filtering logic safe ---
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();

    // Check that each property exists before trying to call .toLowerCase() on it.
    const matchesSearch = searchTerm === "" ||
      (customer.names && customer.names.toLowerCase().includes(searchLower)) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchLower)) ||
      (customer.restaurant && customer.restaurant.toLowerCase().includes(searchLower));

    const matchesFilters = 
      (filters.location === "" || customer.address === filters.location) &&
      (filters.category === "" || customer.category === filters.category) &&
      (filters.status === "" || customer.status === filters.status);
      
    return matchesSearch && matchesFilters;
  });

  // (The rest of your component code remains exactly the same)
  // ...
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

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
    router.push(`/admin/view-customer/${customerId}`);
  };

  const handleEditCustomer = (customerId: string) => {
    router.push(`/admin/edit-customer/${customerId}`);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      const originalCustomers = [...customers];
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/owner/${customerId}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Delete failed.");
        
      } catch (error) {
        console.error('Delete failed:', error);
        alert("Could not delete the owner. Reverting changes.");
        setCustomers(originalCustomers);
      } finally {
        setActiveDropdown(null);
      }
    }
  };

  const handleAddCustomer = () => {
    router.push('/admin/add-owner');
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            
            <h2 className="text-lg font-semibold text-gray-800"> Representatives</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <Button onClick={handleAddCustomer} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Representative</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Location</label>
              <select title="cd" name="location" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="mt-1 block w-full border text-gray-400 border-gray-500 rounded-md p-2">
                <option value="">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Nyamata">Nyamata</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <select title="cd" name="category" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="">All Categories</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select title="cd" name="status" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setFilters({ location: "", category: "", status: "" })} className="px-4 py-2 text-gray-600 hover:text-gray-800">Clear</Button>
              <Button onClick={() => setFilterVisible(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4"><input title="cd" type="checkbox" checked={currentCustomers.length > 0 && selectedCustomers.length === currentCustomers.length} onChange={(e) => handleSelectAll(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/></th>
              <th className="p-4 text-sm font-medium text-gray-700">Name</th>
              <th className="p-4 text-sm font-medium text-gray-700">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-700">Email</th>
              <th className="p-4 text-sm font-medium text-gray-700">Business Name</th>
              <th className="p-4 text-sm font-medium text-gray-700">Created</th>
              <th className="p-4 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Loading owners...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
            ) : currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-4"><input title="f" type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)} className="rounded text-blue-600"/></td>
                  <td className="p-4 flex items-center gap-3">
                    
                    <span className="text-sm font-medium text-gray-800">{customer.names}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.phoneNumber}</td>
                  <td className="p-4 text-sm text-blue-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.restaurant}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.created}</td>
                  <td className="p-4 relative">
                    <Button onClick={() => toggleDropdown(customer.id)} className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="w-5 h-5 text-gray-500" /></Button>
                    {activeDropdown === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <Button onClick={() => handleViewProfile(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye className="w-4 h-4" /> View</Button>
                        <Button onClick={() => handleEditCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Button>
                        <Button onClick={() => handleDeleteCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 flex items-center gap-2"><UserMinus className="w-4 h-4" /> Delete</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No owners match your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} owners
          </span>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">Previous</Button>
            {/* You can add page number buttons here if you wish */}
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;