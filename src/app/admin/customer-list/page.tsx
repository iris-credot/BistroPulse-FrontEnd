"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../components/loadingSpinner";
import { Search, Filter, Plus, MoreVertical, Eye, Edit, UserMinus } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Customer } from '../../../../types/customer';
import { format } from 'date-fns';
import { OwnerFromAPI } from "../../../../types/owner";
import toast from "react-hot-toast";

const CustomerList = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  
  // --- UPDATED FILTERS STATE FOR REPRESENTATIVE AND BUSINESS NAME ---
  const [filters, setFilters] = useState({
    representativeName: "",
    businessName: "",
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

        const response = await fetch(`${apiBaseUrl}/owner`, {
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
        
       const transformedCustomers: Customer[] = data.owners.map((owner: OwnerFromAPI) => {
          const phone = owner.user?.[" phoneNumber"] || owner.user?.phoneNumber || 'N/A';
          const rawName = owner.user?.names || owner.user?.username || owner.user?.email || 'N/A';
          const name = capitalize(rawName);
          const bus=owner.businessName || 'N/A';
          const org = capitalize(bus);

          return {
            id: owner._id,
            names: name,
            email: owner.user?.email || 'N/A',
            phoneNumber: phone,
            restaurant: org,
            location: owner.user?.address || "Kigali",
            avatar: owner.user?.image || "",
            created: format(new Date(owner.createdAt), 'MMM dd, yyyy'),
            orders: [],
            status: owner.user?.verified ? "Active" : "Pending",
            category: "Regular"
          };
        });
        setCustomers(transformedCustomers);
      } catch (err) {
        console.log(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, [apiBaseUrl]);

  // --- UPDATED FILTER LOGIC ---
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();

    // General search bar logic (searches across multiple fields)
    const matchesSearch = searchTerm === "" ||
      (customer.names && customer.names.toLowerCase().includes(searchLower)) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchLower)) ||
      (customer.restaurant && customer.restaurant.toLowerCase().includes(searchLower));

    // Specific filter logic from the filter dropdown
    const matchesFilters = 
      (filters.representativeName === "" || (customer.names && customer.names.toLowerCase().includes(filters.representativeName.toLowerCase()))) &&
      (filters.businessName === "" || (customer.restaurant && customer.restaurant.toLowerCase().includes(filters.businessName.toLowerCase())));
      
    // A customer must match both the general search AND the specific filters
    return matchesSearch && matchesFilters;
  });

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
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = (customerId: string) => {
    setActiveDropdown(prev => prev === customerId ? null : customerId);
  };

  const handleViewProfile = (customerId: string) => { router.push(`/admin/view-customer/${customerId}`); };
  const handleEditCustomer = (customerId: string) => { router.push(`/admin/edit-customer/${customerId}`); };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      const originalCustomers = [...customers];
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/owner/${customerId}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Delete failed.");
        toast.success("Owner deleted successfully.");
      } catch (error) {
        console.log(error);
        setCustomers(originalCustomers);
      } finally {
        setActiveDropdown(null);
      }
    }
  };

  const handleAddCustomer = () => { router.push('/admin/add-owner'); };
  
    const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - 1 <= halfMaxPages) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (totalPages - currentPage < halfMaxPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        pageNumbers.push(<button key="1" onClick={() => setCurrentPage(1)} className="px-3 py-1 border border-gray-300 rounded">1</button>);
        if (startPage > 2) pageNumbers.push(<span key="start-ellipsis" className="px-3 py-1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>
                {i}
            </button>
        );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(<span key="end-ellipsis" className="px-3 py-1">...</span>);
        pageNumbers.push(<button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 border border-gray-300 rounded">{totalPages}</button>);
    }

    return pageNumbers;
  };


  return (
    <div className="bg-white shadow-md rounded-lg dark:bg-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Representatives</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setFilterVisible(!filterVisible)} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <Button onClick={handleAddCustomer} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- UPDATED FILTER DROPDOWN --- */}
      {filterVisible && (
        <div className="absolute right-4 left-4 mt-2 sm:left-auto sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10 dark:bg-gray-900 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Representative Name</label>
              <Input
                type="text"
                name="representativeName"
                value={filters.representativeName}
                onChange={handleFilterChange}
                className="mt-1 w-full"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</label>
              <Input
                type="text"
                name="businessName"
                value={filters.businessName}
                onChange={handleFilterChange}
                className="mt-1 w-full"
                placeholder="e.g. The Grand Hotel"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setFilters({ representativeName: "", businessName: "" })} className="px-4 py-2 text-white  hover:bg-gray-100 dark:text-black dark:hover:bg-gray-800 rounded-md">Clear</Button>
              <Button onClick={() => setFilterVisible(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table & Cards container */}
      <div className="mt-4">
        {loading ? (
            <div className="flex justify-center items-center py-10"><LoadingSpinner /></div>
        ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredCustomers.length > 0 ? (
            <>
                {/* Responsive Card View for Mobile */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {currentCustomers.map(customer => (
                        <div key={customer.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3 relative border dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <input title="select" type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"/>
                                    <span className="font-semibold text-gray-800 dark:text-white">{customer.names}</span>
                                </div>
                                <Button onClick={() => toggleDropdown(customer.id)} className="p-2 -mt-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><MoreVertical className="w-5 h-5 text-gray-500" /></Button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p><strong className="font-medium text-gray-700 dark:text-gray-300">Business:</strong> {customer.restaurant}</p>
                                <p><strong className="font-medium text-gray-700 dark:text-gray-300">Phone:</strong> {customer.phoneNumber}</p>
                                <p><strong className="font-medium text-gray-700 dark:text-gray-300">Email:</strong> {customer.email}</p>
                                <p><strong className="font-medium text-gray-700 dark:text-gray-300">Created:</strong> {customer.created}</p>
                            </div>
                            {activeDropdown === customer.id && (
                              <div className="absolute right-4 top-12 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10 dark:bg-gray-800 dark:border-gray-700">
                                <Button onClick={() => handleViewProfile(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Eye className="w-4 h-4" /> View</Button>
                                <Button onClick={() => handleEditCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Edit className="w-4 h-4" /> Edit</Button>
                                <Button onClick={() => handleDeleteCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 flex items-center gap-2 dark:hover:bg-red-900/50"><UserMinus className="w-4 h-4" /> Delete</Button>
                              </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="p-4"><input title="selectAll" type="checkbox" checked={currentCustomers.length > 0 && selectedCustomers.length === currentCustomers.length} onChange={(e) => handleSelectAll(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/></th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Name</th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Phone</th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Email</th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Business Name</th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Created</th>
                          <th className="p-4 text-sm font-medium text-gray-700 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCustomers.map((customer) => (
                            <tr key={customer.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                              <td className="p-4"><input title="select" type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)} className="rounded text-blue-600"/></td>
                              <td className="p-4 text-sm font-medium text-gray-800 dark:text-white">{customer.names}</td>
                              <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.phoneNumber}</td>
                              <td className="p-4 text-sm text-blue-600">{customer.email}</td>
                              <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.restaurant}</td>
                              <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{customer.created}</td>
                              <td className="p-4 relative">
                                <Button onClick={() => toggleDropdown(customer.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><MoreVertical className="w-5 h-5 text-gray-500" /></Button>
                                {activeDropdown === customer.id && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10 dark:bg-gray-800 dark:border-gray-700">
                                    <Button onClick={() => handleViewProfile(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Eye className="w-4 h-4" /> View</Button>
                                    <Button onClick={() => handleEditCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700"><Edit className="w-4 h-4" /> Edit</Button>
                                    <Button onClick={() => handleDeleteCustomer(customer.id)} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 flex items-center gap-2 dark:hover:bg-red-900/50"><UserMinus className="w-4 h-4" /> Delete</Button>
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
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No owners match your criteria.</div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} owners
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
};

export default CustomerList;