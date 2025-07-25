"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from 'components/loadingSpinner';

// Interfaces for Order and Restaurant data
interface OrderItem {
  menuItem: { name: string; price: number; };
  quantity: number;
  _id: string;
}

// Updated the status enum to match your latest schema
interface Order {
  _id: string;
  user: { firstName: string; lastName: string; email: string; };
  restaurant: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  isPaid: boolean;
  deliveryAddress: string;
  isDelivered: boolean;
  createdAt: string;
  deliveredAt?: string; // Add optional deliveredAt for optimistic update
}

interface Restaurant {
  _id: string;
  name:string;
}

interface RestaurantFromAPI {
    _id: string;
    name: string;
}

const OrderManagement = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // State for data fetching and selection
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);

  // State for loading and errors
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for UI controls
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: "", deliveryStatus: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const itemsPerPage = 10;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Effect 1: Fetch restaurants by owner
  useEffect(() => {
    const fetchRestaurantsByOwner = async () => {
      setRestaurantsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) throw new Error("Authentication failed.");
        
        const user = JSON.parse(storedUser);
        const userId = user?._id;

        if (!userId) throw new Error("User ID not found in session.");

        const ownerResponse = await fetch(`${apiBaseUrl}/owner/user/${userId}`, { headers: getAuthHeaders() });
        if (!ownerResponse.ok) throw new Error("Could not fetch your owner profile.");
        
        const ownerData = await ownerResponse.json();
        const ownerId = ownerData.owner?._id;

        if (!ownerId) throw new Error("Could not identify owner ID.");

        const restaurantsResponse = await fetch(`${apiBaseUrl}/owner/${ownerId}/restaurants`, { headers: getAuthHeaders() });
        if (!restaurantsResponse.ok) throw new Error("Failed to fetch your restaurants.");

        const data: { restaurants: RestaurantFromAPI[] } = await restaurantsResponse.json();
        const formattedRestaurants: Restaurant[] = (data.restaurants || []).map(rest => ({ _id: rest._id, name: rest.name }));
        
        setRestaurants(formattedRestaurants);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
        setRestaurants([]);
      } finally {
        setRestaurantsLoading(false);
      }
    };
    fetchRestaurantsByOwner();
  }, [apiBaseUrl]);

  // Effect 2: Fetch orders for the selected restaurant
  useEffect(() => {
    if (!selectedRestaurantId) {
      setOrders([]);
      return;
    }
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setError(null);
      setActiveDropdown(null);
      try {
        // Corrected the URL based on your router: /rest/:id
        const response = await fetch(`${apiBaseUrl}/order/rest/${selectedRestaurantId}`, {
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setOrders([]);
            return;
          }
          throw new Error('Failed to fetch orders.');
        }
        
        const data = await response.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [selectedRestaurantId, apiBaseUrl]);

  // --- NEW: handleUpdateStatus function with real API call ---
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const originalOrders = [...orders];

    // Optimistically update the UI
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus, isDelivered: newStatus === 'Completed' }
          : order
      )
    );
    setActiveDropdown(null);

    try {
      // Use the new /:id/status route
      const response = await fetch(`${apiBaseUrl}/order/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // If the server responds with an error, revert the UI and show a toast
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status.');
      }

      const { order: updatedOrder } = await response.json();

      // Update the state with the confirmed data from the server
      setOrders(prevOrders =>
        prevOrders.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
      );

      toast.success('Order status updated!');

    } catch (error) {
      // Revert the optimistic update on failure
      setOrders(originalOrders);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Update failed: ${message}`);
    }
  };


  // Filtering logic for orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status ? order.status === filters.status : true;
      const deliveryStatus = order.isDelivered ? 'Delivered' : 'Not Delivered';
      const matchesDelivery = filters.deliveryStatus ? deliveryStatus === filters.deliveryStatus : true;
      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [orders, searchTerm, filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);


  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 min-h-screen">
      
      {/* Restaurant Selector */}
      <div className="max-w-xl mx-auto mb-8 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-2">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          {selectedRestaurantId ? `Viewing orders for ${restaurants.find(r => r._id === selectedRestaurantId)?.name}` : "Select a restaurant to view orders"}
        </p>
        <label htmlFor="restaurant-select" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
          Your Restaurants
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
      {error && !restaurantsLoading && (
        <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {selectedRestaurantId && (
        <>
          {/* Search and Filter Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Restaurant Orders</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input type="text" placeholder="Search by Order ID..." title="Search by Order ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:text-white" aria-label="Search orders" />
              </div>
              <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Toggle filters">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>

          {/* Filter UI */}
          {filterVisible && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Order Status</label>
                  <select name="status" title="Filter by order status" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="mt-1 block w-full border text-gray-700 dark:text-white border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Delivery</label>
                  <select name="deliveryStatus" title="Filter by delivery status" value={filters.deliveryStatus} onChange={(e) => setFilters({...filters, deliveryStatus: e.target.value})} className="mt-1 block w-full text-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600">
                    <option value="">All</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Not Delivered">Not Delivered</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => setFilters({ status: "", deliveryStatus: "" })} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md w-full">Clear Filters</Button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          {ordersLoading ? (
            <div className="text-center p-10"><LoadingSpinner/></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                {orders.length === 0 ? "No orders have been placed at this restaurant yet." : "No orders match your search criteria."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Order ID</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Date</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Total Price</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Payment</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Delivered</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="p-4 text-sm font-mono text-gray-500 dark:text-gray-400" title={order._id}>...{order._id.slice(-8)}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-medium text-gray-800 dark:text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' 
                          : order.status === 'Cancelled' ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.isPaid ? 'Paid' : 'Unpaid'}</td>
                      <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isDelivered ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                          {order.isDelivered ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 relative">
                        <Button title='Actions' disabled={order.status === 'Completed' || order.status === 'Cancelled'} onClick={() => setActiveDropdown(activeDropdown === order._id ? null : order._id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </Button>
                        {activeDropdown === order._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                            <Button onClick={() => router.push(`/owner/view-order/${order._id}`)} className="w-full px-4 py-2 text-sm text-left text-white hover:text-black dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2"><Eye className="w-4 h-4" /> View Details</Button>
                            <Button onClick={() => handleUpdateStatus(order._id, 'Confirmed')} className="w-full px-4 py-2 text-sm text-left text-white hover:text-black dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex dark:hover:text-white items-center gap-2"><Edit className="w-4 h-4" /> Confirm Order</Button>
                            <Button onClick={() => handleUpdateStatus(order._id, 'Completed')} className="w-full px-4 py-2 text-sm text-left text-white hover:text-black dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex dark:hover:text-white items-center gap-2">
                              <CheckCircle className="w-4 h-4" /> Mark as Completed
                            </Button>
                             <Button onClick={() => handleUpdateStatus(order._id, 'Cancelled')} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/40 flex items-center gap-2">
                              <XCircle className="w-4 h-4" /> Cancel Order
                            </Button>
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
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders</span>
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

export default OrderManagement;