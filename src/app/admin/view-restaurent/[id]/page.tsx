// FILE: app/admin/restaurents/[id]/page.tsx

"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa"; // Will be used for ratings
import { FiEdit3 } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { Button } from '../../../../../components/Button';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from "../../../../../components/loadingSpinner";
import { Restaurant } from "../../../../../types/restaurant";
import RestaurantAgentOverview from "../../../../../components/restaurantAgent"; // Corrected import

const RestaurantOverviewPage: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setError("Restaurant ID not found.");
      setLoading(false);
      return;
    }

    const fetchRestaurantDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(`${apiBaseUrl}/restaurant/${restaurantId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details.");
        }

        const data = await response.json();
        if (!data.restaurant) {
          throw new Error("Restaurant data not found in API response.");
        }
        setRestaurant(data.restaurant);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId,apiBaseUrl]);

  // Helper function to format the address
  const formatAddress = (addr: Restaurant['address']) => {
    if (!addr) return 'No address provided';
    return `${addr.street || ''}, ${addr.city || ''}`.replace(/^, |, $/g, '');
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!restaurant) {
    return <div className="p-6 text-center">No restaurant data available.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Restaurant Details Column */}
      <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg dark:text-white">Restaurant Overview</h2>
          <div className="flex items-center gap-2">
            <span className={restaurant.status === 'Open' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {restaurant.status}
            </span>
            <Button onClick={() => router.push(`/admin/edit-restaurent/${restaurant._id}`)} className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center gap-1">
              <FiEdit3 /> Edit
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl">
          <Image
            src={restaurant.image && restaurant.image.startsWith("http") ? restaurant.image : "/fifth.png"}
            alt={restaurant.name}
            width={700}
            height={400}
            className="rounded-xl object-cover w-full h-[250px]"
          />
        </div>

        <h3 className="text-xl font-semibold mt-4 dark:text-white">{restaurant.name}</h3>

        {/* ✅ FIX: FaStar is now used here */}
        <div className="flex items-center text-sm text-gray-500 mt-1 gap-2 dark:text-gray-300">
          <FaStar className="text-yellow-500" />
          <span>5.0 (23 Reviews)</span> {/* This can be dynamic later */}
          <span>•</span>
          <span>23 Orders</span> {/* This can be dynamic later */}
        </div>

        {/* ✅ FIX: The entire details section is restored, using formatAddress */}
        <div className="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-200">
          <div>
            <h4 className="font-bold">Established</h4>
            <p className="text-gray-500 dark:text-gray-300">
              {new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <h4 className="font-bold">Description</h4>
            <p className="text-gray-500 dark:text-gray-300">{restaurant.description || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-bold">Working Period</h4>
            <p className="text-gray-500 dark:text-gray-300">{restaurant.openingHours || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-bold">Location</h4>
            <p className="text-gray-500 dark:text-gray-300">
              {formatAddress(restaurant.address)}
            </p>
          </div>
        </div>
      </div>

      {/* Agent/Representative Column */}
      <div className="w-full md:w-1/3 space-y-6">
        {restaurant.owner?._id ? (
          <RestaurantAgentOverview ownerId={restaurant.owner._id} />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md text-center dark:bg-gray-800">
            No Representative Assigned.
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOverviewPage;