"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { useParams } from 'next/navigation';
import LoadingSpinner from "components/loadingSpinner";

// --- Interfaces are correct and remain the same ---
interface ApiMenuItem {
    menuItem: { _id: string; name: string; price: number; };
    quantity: number;
    _id: string;
}
interface ApiOrder {
    _id: string;
    createdAt: string;
    deliveryAddress: string;
    items: ApiMenuItem[];
    status: string;
    totalPrice: number; // We will ignore this value
    user: { _id: string; email: string; name?: string; phone?: string; image?: string; };
    restaurant: { _id: string; name: string; phone: string; };
}
interface EnrichedOrder {
    id: string;
    status: string;
    createdAt: string;
    totalPrice: number; // This will hold our calculated total
    deliveryAddress: string;
    customer: { name: string; email: string; phone: string; image: string; };
    restaurantName: string;
    items: { name: string; price: number; quantity: number; }[];
}

export default function OrderTrackingPage() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<EnrichedOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Order ID not found in URL.");
            setIsLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Authentication token not found.");

                const response = await fetch(`${apiBaseUrl}/order/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch order details.`);
                }
                
                const { order: orderData }: { order: ApiOrder } = await response.json();

                const combinedItems = orderData.items.map(item => ({
                    name: item.menuItem.name || 'Unknown Item',
                    price: item.menuItem.price || 0,
                    quantity: item.quantity,
                }));
                
                // --- FIX: Calculate the total price manually from the items ---
                const calculatedTotal = combinedItems.reduce((sum, item) => {
                    return sum + (item.price * item.quantity);
                }, 0); // Start the sum at 0

                setOrder({
                    id: orderData._id,
                    status: orderData.status,
                    createdAt: new Date(orderData.createdAt).toLocaleString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
                    }),
                    totalPrice: calculatedTotal, // Use our newly calculated total
                    deliveryAddress: orderData.deliveryAddress,
                    customer: {
                        name: orderData.user.name || orderData.user.email,
                        email: orderData.user.email,
                        phone: orderData.user.phone || 'Not Available',
                        image: orderData.user.image || '/images/customer.png', 
                    },
                    restaurantName: orderData.restaurant.name,
                    items: combinedItems,
                });

            } catch (err) {
                // Restore error handling to show feedback in the UI
              
                console.error("Failed to fetch order details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId,apiBaseUrl]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white"><LoadingSpinner/></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 dark:bg-gray-900">{error}</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-gray-400">Order not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b dark:border-gray-700 pb-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold dark:text-white">Order Id #{order.id.slice(-6).toUpperCase()}</h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">{order.status}</span>
                            <span className="text-gray-400">{order.customer.name}</span>
                            <span>• {order.createdAt}</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <h3 className="text-lg font-semibold border-b dark:border-gray-700 pb-2 mb-4 dark:text-white">Summary for {order.restaurantName}</h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div>{item.name} (x{item.quantity})</div>
                                <div>₵ {(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                        
                        <div className="flex items-center justify-between font-medium border-t dark:border-gray-700 pt-2">
                            {/* This space can be used for Subtotal if needed, but Total is more important */}
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold border-t dark:border-gray-700 pt-2 text-gray-800 dark:text-white">
                            <div>Total</div>
                            {/* Use the authoritative totalPrice which now holds our calculated value */}
                            <div>₵ {order.totalPrice.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold dark:text-white">Customer Info</h3>
                        <div className="flex items-center gap-4">
                            <Image src={order.customer.image} alt="Customer" width={48} height={48} className="rounded-full object-cover" />
                            <div>
                                <p className="font-semibold dark:text-white">{order.customer.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</p>
                            </div>
                        </div>
                        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400 pt-2"><Phone size={16} className="mr-2" /> {order.customer.phone}</p>
                        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400"><MapPin size={16} className="mr-2" /> {order.deliveryAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}