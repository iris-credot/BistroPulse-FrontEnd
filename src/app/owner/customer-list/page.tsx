"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Eye,  } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import LoadingSpinner from "components/loadingSpinner";

// Interface for customer data from the API, updated to match backend model
interface Customer {
  _id: string;
  names: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string; // This will be the raw date string from the API
  image?: string;
  category?: string;
  status?: string;
}

const CustomerList = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  // FIX: Renamed 'location' to 'address' to match the Customer interface
  const [filters, setFilters] = useState({ address: "", category: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  // Effect for fetching initial data from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) throw new Error("Authentication failed. Please log in again.");
        
        const user = JSON.parse(storedUser);
        if (!user?._id) throw new Error("User ID not found in your session.");

        const ownerResponse = await fetch(`${apiBaseUrl}/owner/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!ownerResponse.ok) throw new Error("Could not fetch your owner profile.");
        
        const ownerData = await ownerResponse.json();
        const ownerId = ownerData.owner?._id;
        if (!ownerId) throw new Error("Could not identify the owner ID for your profile.");

        const response = await fetch(`${apiBaseUrl}/owner/${ownerId}/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) throw new Error('Your session has expired. Please log in again.');

        const data = await response.json();

        if (data.success && Array.isArray(data.customers)) {
          // FIX: Sort customers by date (latest first) before any processing
          const sortedCustomers = data.customers.sort((a: Customer, b: Customer) => 
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );

          // FIX: Map over sorted data, use correct properties, and format the date
          const formattedCustomers = sortedCustomers.map((customer: Customer) => ({
            ...customer,
            image: customer.image || '/images/default-avatar.png',
            // Overwrite createdAt with a user-friendly, date-only format
            createdAt: customer.createdAt 
              ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A',
          }));
          setAllCustomers(formattedCustomers);
        } else {
          throw new Error(data.message || 'Failed to fetch customers.');
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [apiBaseUrl]);

  // Effect for filtering and searching
  useEffect(() => {
    let customers = allCustomers;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      // FIX: Use 'names' property for searching
      customers = customers.filter(customer =>
        customer.names.toLowerCase().includes(lowercasedTerm) ||
        customer.email.toLowerCase().includes(lowercasedTerm)
      );
    }

    // FIX: Use 'address' property for filtering
    customers = customers.filter(customer =>
        (filters.address === "" || customer.address === filters.address) &&
        (filters.category === "" || customer.category === filters.category) &&
        (filters.status === "" || customer.status === filters.status)
    );

    setFilteredCustomers(customers);
    setCurrentPage(1);
  }, [searchTerm, filters, allCustomers]);


  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectedCustomers(checked ? currentCustomers.map(c => c._id) : []);
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    setSelectedCustomers(prev =>
      checked ? [...prev, customerId] : prev.filter(id => id !== customerId)
    );
  };

  const toggleDropdown = (customerId: string) => {
    setActiveDropdown(prev => prev === customerId ? null : customerId);
  };

  const handleViewProfile = (customerId: string) => router.push(`/owner/view-customer/${customerId}`);
  

  return (
    <div className="bg-white shadow-md rounded-lg dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Customers</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input type="text" placeholder="Search customers..." title="Search customers by name or email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Search customers" />
            </div>
            <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" aria-label="Filter">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter dropdown */}
      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border dark:bg-gray-800 border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Location</label>
              {/* FIX: Use 'address' for filter state and name */}
              <select name="address" title="Filter by customer location" value={filters.address} onChange={(e) => setFilters({...filters, address: e.target.value})} className="mt-1 block w-full border text-gray-500 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Nyamata">Nyamata</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setFilters({ address: "", category: "", status: "" })}>Clear</Button>
              <Button onClick={() => setFilterVisible(false)} className="bg-blue-600 text-white">Apply</Button>
            </div>
          </div>
        </div>
      )}

      {/* Customer table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4"><input type="checkbox" title="Select all customers on this page" checked={currentCustomers.length > 0 && selectedCustomers.length === currentCustomers.length} onChange={(e) => handleSelectAll(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" aria-label="Select all customers on this page" /></th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Name</th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Email</th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Location</th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Created</th>
              <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500"><LoadingSpinner/></td></tr>
            ) : error ? (
                <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
            ) : currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4"><input title={`Select customer ${customer.names}`} type="checkbox" checked={selectedCustomers.includes(customer._id)} onChange={(e) => handleSelectCustomer(customer._id, e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="p-4 flex items-center gap-3">
                    {/* FIX: Use 'image' and 'names' properties */}
                    <Image src={customer.image!} alt={customer.names} width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer.names}</span>
                  </td>
                  {/* FIX: Use 'phoneNumber', 'address', and formatted 'createdAt' */}
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.phoneNumber || 'N/A'}</td>
                  <td className="p-4 text-sm text-blue-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.address || 'N/A'}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.createdAt}</td>
                  <td className="p-4 relative">
                    <Button onClick={() => toggleDropdown(customer._id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"><MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-300" /></Button>
                    {activeDropdown === customer._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <Button onClick={() => handleViewProfile(customer._id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"><Eye className="w-4 h-4" /> View</Button>
                       
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
           <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">Page {currentPage} of {totalPages}</span>
           <div className="flex items-center gap-2">
                <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</Button>
                <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;