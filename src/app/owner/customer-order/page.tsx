'use client';

import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { FaEye } from 'react-icons/fa';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Order, OrderStatus } from '../../../../types/order';
import Image from 'next/image';

// Define a type for the API response to match the backend structure
type ApiResponse = {
  orders: Order[];
};

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-yellow-500',
  Preparing: 'text-blue-500',
  Cancelled: 'text-red-500',
  Delivered: 'text-green-500',
  'On the way': 'text-cyan-500',
};

const CustomerOrder: NextPage = () => {
    // State for data and loading
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for UI and filtering
    const [showFilter, setShowFilter] = useState(false);
    const [activeTag, setActiveTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [statusFromModal, setStatusFromModal] = useState<string>('');
    
    // Get restaurantId from the URL
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    // Fetch data on component mount or when restaurantId changes
    useEffect(() => {
        if (!restaurantId) {
            setError("Restaurant ID is missing from the URL.");
            setIsLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            
            // --- FIX: Retrieve token from localStorage ---
            const token = localStorage.getItem('authToken'); // Assuming you store your token with this key
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setIsLoading(false);
                return;
            }

            try {
                // --- FIX: Add Authorization header to the fetch request ---
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}/order/rest/${restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error: ${response.status}`);
                }

                const data: ApiResponse = await response.json();
                setOrders(data.orders || []); // Ensure orders is always an array
            } catch (err) {
                setError('err');
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [restaurantId]);

    // --- FIX: Implement filtering logic to use all state variables ---
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                // Filter by active top tag (e.g., 'Pending', 'Delivered')
                if (activeTag === 'All') return true;
                // Handle different wording for status
                if (activeTag === 'Being Prepared') return order.status === 'Preparing';
                if (activeTag === 'On The Way') return order.status === 'On the way';
                return order.status === activeTag;
            })
            .filter(order => {
                // Filter by search query (customer name)
                return order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .filter(order => {
                // Filter by price range and status from the modal
                const isPriceMatch = order.price >= priceRange[0] && order.price <= priceRange[1];
                const isStatusMatch = statusFromModal ? order.status === statusFromModal : true;
                return isPriceMatch && isStatusMatch;
            });
    }, [orders, activeTag, searchQuery, priceRange, statusFromModal]);

    // --- Handlers for filter controls ---
    const applyAdvancedFilter = () => {
        // The filtering is already done by the useMemo hook.
        // We just need to close the modal.
        setShowFilter(false);
    };

    const clearAdvancedFilter = () => {
        setPriceRange([0, 1000]);
        setStatusFromModal('');
        setShowFilter(false);
    };


    if (isLoading) {
        return <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center"><p>Loading orders...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center"><p className="text-red-500">Error: {error}</p></div>;
    }

    return (
        <>
            <Head>
                <title>Orders Dashboard</title>
            </Head>
            <main className="min-h-screen bg-gray-100 p-6">
                <div className="relative p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Orders ({filteredOrders.length})</h2>
                        <div className="flex gap-2">
                            <Input 
                                type="text" 
                                placeholder="Search by customer..." 
                                className="border px-2 py-1 rounded"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button onClick={() => setShowFilter(!showFilter)} className="border px-3 py-1 rounded bg-gray-100">Filter</Button>
                            <Button className="border px-3 py-1 rounded bg-gray-100">Export ▼</Button>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                        {['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'].map(tag => (
                            <Button 
                                key={tag} 
                                onClick={() => setActiveTag(tag)}
                                className={`px-3 py-1 text-sm border rounded-full ${activeTag === tag ? 'bg-black text-white' : 'bg-gray-100'}`}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>

                    {showFilter && (
                        <div className="absolute top-16 right-10 z-50 bg-white p-5 rounded-xl shadow-lg w-72 border">
                            <h3 className="text-lg font-semibold mb-4 text-blue-600">Filter Options</h3>
                            <label className="block text-sm mb-1">Price Range</label>
                            <div className="flex justify-between text-sm mb-2 text-gray-600">
                                <span>GHC {priceRange[0]}</span><span>GHC {priceRange[1]}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input title="min-price" type="range" min="0" max="1000" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-full accent-black"/>
                                <Input title="max-price" type="range" min="0" max="1000" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-full accent-black"/>
                            </div>
                            <label className="block text-sm mt-4 mb-1">Status</label>
                            <select title="status-select" value={statusFromModal} onChange={(e) => setStatusFromModal(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
                                <option value="">Select Status</option>
                                {['Pending', 'Preparing', 'Cancelled', 'Delivered', 'On the way'].map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="mt-4 flex gap-2">
                                <Button onClick={clearAdvancedFilter} className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100">Clear</Button>
                                <Button onClick={applyAdvancedFilter} className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Apply</Button>
                            </div>
                        </div>
                    )}

                    <table className="w-full table-auto border text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3"><input title='select-all' type="checkbox" /></th>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="p-3"><input title={`select-${order.id}`} type="checkbox" /></td>
                                        <td className="p-3">{order.id}</td>
                                        <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                {order.customer.avatar && <Image src={order.customer.avatar} alt={order.customer.name} width={24} height={24} className="rounded-full" />}
                                                <span>{order.customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">₵ {order.price.toFixed(2)}</td>
                                        <td className={`p-3 font-medium ${statusColor[order.status]}`}>{order.status}</td>
                                        <td className="p-3">
                                            <Link href={`/owner/order-overview/${order.id}`}>
                                                <FaEye className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No orders match the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4 text-sm">
                        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                        {/* You can add a real pagination component here if needed */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default CustomerOrder;