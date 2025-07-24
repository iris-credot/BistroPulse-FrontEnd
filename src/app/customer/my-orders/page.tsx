'use client';

import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { FaEye } from 'react-icons/fa';
import { Plus } from "lucide-react";
import { Button } from '../../../../components/Button';
import LoadingSpinner from 'components/loadingSpinner';
import { Order, OrderStatus } from '../../../../types/order';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

// --- MODIFIED: Interface for items within an order from the API ---
interface ApiMenuItem {
    menuItem: {
        price: number;
    };
    quantity: number;
}

// --- MODIFIED: Updated ApiOrder interface to include the 'items' array ---
interface ApiOrder {
    _id: string;
    createdAt: string;
    totalPrice?: number | null;
    status: OrderStatus;
    items: ApiMenuItem[]; // Added items array for calculation
    restaurant?: {
        name:string;
        image?: string | null;
    };
}

const statusColor: Record<OrderStatus, string> = {
    Pending: 'text-yellow-500 dark:text-yellow-400',
    Preparing: 'text-blue-500 dark:text-blue-400',
    Cancelled: 'text-red-500 dark:text-red-400',
    Delivered: 'text-green-500 dark:text-green-400',
    'On the way': 'text-cyan-500 dark:text-cyan-400',
};

// --- NEW: Function to calculate total price from order items ---
/**
 * Calculates the total price of an order by summing the price of each item multiplied by its quantity.
 * @param items - The array of items in the order.
 * @param fallbackPrice - An optional fallback price to use if calculation is not possible.
 * @returns The calculated total price.
 */
const calculateOrderTotal = (items: ApiMenuItem[], fallbackPrice: number | null | undefined): number => {
    // If items array is missing or empty, return the fallback price or 0.
    if (!items || items.length === 0) {
        return fallbackPrice || 0;
    }

    // Use reduce to sum up the total price from the items.
    const total = items.reduce((sum, currentItem) => {
        const itemPrice = currentItem.menuItem?.price || 0;
        const itemQuantity = currentItem.quantity || 0;
        return sum + (itemPrice * itemQuantity);
    }, 0);

    return total;
};


const CustomerOrder: NextPage = () => {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showFilter, setShowFilter] = useState(false);
  
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (!storedUser || !token) {
                    throw new Error("You are not authenticated. Please log in.");
                }

                const user = JSON.parse(storedUser);
                const userId = user?._id;

                if (!userId) {
                    throw new Error("User ID not found. Please log in again.");
                }

                const response = await fetch(`${apiBaseUrl}/order/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch orders.');
                }

                const data: { orders: ApiOrder[] } = await response.json();
                
                const mappedOrders: Order[] = data.orders.map((apiOrder: ApiOrder) => ({
                    id: apiOrder._id,
                    date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                    customer: {
                        name: apiOrder.restaurant?.name || 'Restaurant N/A',
                        avatar: apiOrder.restaurant?.image || 'https://i.pravatar.cc/40',
                    },
                    // --- THE FIX: Use the new calculation function for the price ---
                    price: calculateOrderTotal(apiOrder.items, apiOrder.totalPrice),
                    status: apiOrder.status,
                }));

                setAllOrders(mappedOrders);
                setFilteredOrders(mappedOrders);

            } catch (err) {
                
                console.error("Fetch orders error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [apiBaseUrl]);

    useEffect(() => {
        let result = allOrders;

        if (searchTerm) {
            result = result.filter(order =>
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredOrders(result);
    }, [searchTerm, allOrders]);


    const handleAddOrder = () => {
        router.push('/customer/add-menu');
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10 dark:text-white"><LoadingSpinner/></div>;
        }

        if (error) {
            return <div className="text-center p-10 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>;
        }

        if (filteredOrders.length === 0) {
            return <div className="text-center p-10 dark:text-gray-400">No orders found.</div>;
        }

        return (
            <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                <table className="w-full table-auto text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3"><input title='select-all-orders' type="checkbox" className="dark:bg-gray-800 dark:border-gray-600 rounded" /></th>
                            <th className="p-3">Order Id</th>
                            <th className="p-3">Restaurant</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-gray-300">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                                <td className="p-3"><input title={`select-order-${order.id}`} type="checkbox" className="dark:bg-gray-800 dark:border-gray-600 rounded"/></td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium dark:text-white">{order.id}</span>
                                    </div>
                                </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium dark:text-white">{order.customer.name}</span>
                                    </div>
                                </td>
                                <td className="p-3">{order.date}</td>
                                <td className="p-3">₵ {order.price.toFixed(2)}</td>
                                <td className={`p-3 font-medium ${statusColor[order.status] || 'text-gray-500'}`}>{order.status}</td>
                                <td className="p-3">
                                    <Link href={`/customer/order-overview/${order.id}`}>
                                        <FaEye className="text-blue-600 dark:text-blue-400 cursor-pointer hover:scale-110 transition-transform" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

  return (
    <>
      <Head>
        <title>Orders Dashboard</title>
      </Head>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Orders</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by Restaurant..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
              />
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="border px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Filter
              </Button>
              <Button title='New Order' onClick={handleAddOrder} className="flex items-center justify-center gap-2 text-white border px-3 py-1 rounded bg-blue-500 hover:bg-blue-600">
                <Plus className="w-5 h-5" /> <span>New Order</span>
              </Button>
            </div>
          </div>
          
          {renderContent()}

          {!isLoading && !error && filteredOrders.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-400">
                <span>Showing {filteredOrders.length} of {allOrders.length} orders</span>
                <div className="flex gap-1">
                {[1].map(p => (
                    <button key={p} className={`px-2 py-1 rounded ${p === 1 ? 'bg-black text-white dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {p}
                    </button>
                ))}
                </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default CustomerOrder;