"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Download, MoreVertical, Eye, Edit, UserMinus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  restaurant: string;
  created: string;
  avatar: string;
  category?: string;
  status?: string;
  orders?: { id: number; details: string; date: string; status: string }[];
}

interface CustomerListProps {
  customers?: Customer[]; // Made optional
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers = [], // Default empty array
  setCustomers 
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({ 
    restaurant: "", 
    category: "", 
    status: "" 
  });

  const itemsPerPage = 10;

  // Safely filter customers
  const filteredCustomers = customers.filter(customer => {
    return (
      (filters.restaurant === "" || customer.restaurant === filters.restaurant) &&
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

  const handleViewProfile = () => {
    router.push('/admin/view-customer');
    setActiveDropdown(null);
  };

  const handleEditCustomer = () => {
    router.push('/admin/edit-customer');
    setActiveDropdown(null);
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleAddCustomer = () => {
    
    router.push('/admin/add-customer');
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header with search and actions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                title="Search customers by name, email, or phone"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                aria-label="Search customers"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setFilterVisible(!filterVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                aria-label="Filter"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              <button
                onClick={handleAddCustomer}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                aria-label="Add customer"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Customer</span>
              </button>
              
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                aria-label="Export"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter dropdown */}
      {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Location</label>
              <select
                name="location"
                title="Filter by customer location"
                value={filters.restaurant}
                onChange={(e) => setFilters({...filters, restaurant: e.target.value})}
                className="mt-1 block w-full border text-gray-400 border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Rwamagana">Rwamagana</option>
                <option value="Kayonza">Kayonza</option>
                <option value="Nyamata">Nyamata</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <select
                name="category"
                title="Filter by customer category"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="AI">AI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                title="Filter by customer status"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFilters({ restaurant: "", category: "", status: "" })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setFilterVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* Customer table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                   title="Search customers by name, email, or phone"
                  checked={selectedCustomers.length > 0 && selectedCustomers.length === currentCustomers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-sm font-medium text-gray-700">Name</th>
              <th className="p-4 text-sm font-medium text-gray-700">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-700">Email</th>
              <th className="p-4 text-sm font-medium text-gray-700">Restaurant</th>
              <th className="p-4 text-sm font-medium text-gray-700">Created</th>
              <th className="p-4 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                       title="Search customers by name, email, or phone"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
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
                  
                  <td className="p-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="p-4 text-sm text-blue-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.restaurant}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.created}</td>
                  
                  <td className="p-4 relative">
                    <button
                     title="Search customers by name, email, or phone"
                      onClick={() => toggleDropdown(customer.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {activeDropdown === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleViewProfile()}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => handleEditCustomer()}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                        >
                          <UserMinus className="w-4 h-4" /> Delete
                        </button>
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
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              
              if (page < 1 || page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;