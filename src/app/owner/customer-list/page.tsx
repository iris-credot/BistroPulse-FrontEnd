"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Plus,  MoreVertical, Eye, Edit, UserMinus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';

interface Customer {
  id:  number;
  name: string;
  phone: string;
  email: string;
  restaurant?: string;
  location: string;
  created?: string;
  avatar: string;
  category?: string;
  status?: string;
  orders?: { id: number; details: string; date: string; status: string }[];
}
const CustomerList = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({ 
    location: "", 
    category: "", 
    status: "" 
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockCustomers: Customer[] = [
          {
            id: 1,
            name: "John Doe",
          
            restaurant: "Kigali Restaurant",
            email: "john@example.com",
            phone: "+250788123456",
          
            location: "Kigali",
            avatar: "/images/avatar1.jpg",
            created: "Jun 15, 2023",
            orders: [],
            status: "Active",
            category: "Regular"
          },
          {
            id: 2,
            name: "Jane Smith",
          
          
            restaurant: "Nyamata Cafe",
            email: "jane@example.com",
            phone: "+250788654321",
          
            location: "Nyamata",
            avatar: "/images/avatar2.jpg",
            created: "Jul 20, 2023",
            orders: [],
            status: "Active",
            category: "VIP"
          },
          // Add more customers as needed
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
      } catch (err) {
        setError('Failed to fetch customers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    return (
      (filters.location === "" || customer.location === filters.location) &&
      (filters.category === "" || customer.category === filters.category) &&
      (filters.status === "" || customer.status === filters.status)
    );
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedCustomers(checked ? currentCustomers.map(c => c.id) : []);
  };

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    setSelectedCustomers(prev => 
      checked ? [...prev, customerId] : prev.filter(id => id !== customerId)
    );
  };

  const toggleDropdown = (customerId: number) => {
    setActiveDropdown(prev => prev === customerId ? null : customerId);
  };

  const handleViewProfile = (customerId: number) => {
    router.push(`/owner/view-customer/${customerId}`);
    setActiveDropdown(null);
  };

  const handleEditCustomer = (customerId: number) => {
    router.push(`/owner/edit-customer/${customerId}`);
    setActiveDropdown(null);
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      
      // API call would go here
      // try {
      //   await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
      // } catch (error) {
      //   console.error('Delete failed:', error);
      //   setCustomers(customers); // Revert on error
      // }
    }
  };

  const handleAddCustomer = () => {
    router.push('/owner/add-customer');
  };

  return (
    <div className="bg-white shadow-md rounded-lg dark:bg-gray-800">
      {/* Header with search and actions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Customers</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search customers..."
                title="Search customers by name, email, or phone"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search customers"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setFilterVisible(!filterVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                aria-label="Filter"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              
              <Button
                onClick={handleAddCustomer}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white dark:text-black rounded-lg hover:bg-blue-700"
                aria-label="Add customer"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline ">Add Customer</span>
              </Button>
              
             
            </div>
          </div>
        </div>
      </div>

      {/* Filter dropdown */}
      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border dark:bg-gray-800 border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:bg-gray-800">Location</label>
              <select
                name="location"
                title="Filter by customer location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="mt-1 block w-full border text-gray-400 dark:bg-gray-800 border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Rwamagana">Rwamagana</option>
                <option value="Kayonza">Kayonza</option>
                <option value="Nyamata">Nyamata</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:bg-gray-800">Category</label>
              <select
                name="category"
                title="Filter by customer category"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="mt-1 block w-full dark:bg-gray-800 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="AI">AI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium dark:bg-gray-800 text-gray-700">Status</label>
              <select
                name="status"
                title="Filter by customer status"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="mt-1 block w-full border dark:bg-gray-800 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
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
                className="px-4 py-2 bg-blue-600 text-white dark:text-black rounded-lg hover:bg-blue-700"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Customer table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr className="dark:bg-gray-600 dark:text-white">
              <th className="p-4">
                <input
                  type="checkbox"
                  title="Select all customers"
                  checked={selectedCustomers.length > 0 && selectedCustomers.length === currentCustomers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  aria-label="Select all customers"
                />
              </th>
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
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      title={`Select ${customer.name}`}
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 "
                      aria-label={`Select ${customer.name}`}
                    />
                  </td>
                  
                  <td className="p-4 flex items-center gap-3">
                    <Image
                      src={customer.avatar}
                      alt={customer.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">{customer.name}</span>
                  </td>
                  
                  <td className="p-4 text-sm text-gray-600 dark:text-white">{customer.phone}</td>
                  <td className="p-4 text-sm text-blue-600 dark:text-white">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-white">{customer.location}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-white">{customer.created}</td>
                  
                  <td className="p-4 relative">
                    <Button
                      title={`Actions for ${customer.name}`}
                      onClick={() => toggleDropdown(customer.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      aria-label={`Actions for ${customer.name}`}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </Button>
                    
                    {activeDropdown === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <Button
                          onClick={() => handleViewProfile(customer.id)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Button>
                        <Button
                          onClick={() => handleEditCustomer(customer.id)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                        >
                          <UserMinus className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
          </span>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              
              if (page < 1 || page > totalPages) return null;
              
              return (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;