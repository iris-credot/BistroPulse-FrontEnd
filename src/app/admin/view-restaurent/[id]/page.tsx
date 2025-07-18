"use client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { Button } from '../../../../../components/Button';
import { useRouter } from 'next/navigation'; 
import LoadingSpinner from "../../../../../components/loadingSpinner";
import RestaurantAgentOverview from "../../view-agentRestau/page"; // Assuming this is the correct path
import { Restaurant } from "../../../../../types/restaurant";
import { useParams } from 'next/navigation'; 

// --- Step 2: Define the component as a Next.js page, accepting params ---



const RestaurantOverviewPage: React.FC = () => {
     const router = useRouter();
 const params = useParams();
  // Get the id, ensuring it can be a string or string[] and taking the first if array
  const restaurantId = Array.isArray(params.id) ? params.id[0] : params.id;
  // --- Step 3: Add state for data, loading, and error handling ---
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Step 4: Fetch restaurant data when the component mounts ---
  useEffect(() => {
    if (!restaurantId) {
      setError("Restaurant ID not found.");
      setLoading(false);
      return;
    }

    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/restaurant/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details.");
        }

        const data = await response.json();
        // API response might have the main object under a 'restaurant' key
        if (!data.restaurant) {
             throw new Error("Restaurant data not found in API response.");
        }
        setRestaurant(data.restaurant);

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // --- Step 5: Handle UI for loading and error states ---
 if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!restaurant) {
    return <div className="p-6 text-center">No restaurant data available.</div>;
  }
  
  // Helper to format address
   const formatAddress = (addr: Restaurant['address']) => {
      if (!addr) return 'No address provided';
      return `${addr.street || ''}, ${addr.city || ''}`.replace(/^, |, $/g, '');
  }

  // --- Step 6: Render the component with dynamic data ---
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-900 max-h-screen max-w-screen">
      <div className="w-2/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Restaurant Overview</h2>
          <div className="flex items-center gap-2">
            <span className={restaurant.status === 'Open' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {restaurant.status}
            </span>
            <Button onClick={() => router.push(`/admin/edit-restaurent/${restaurant.id}`)} className="bg-blue-500 dark:bg-gray-900 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
              <FiEdit3 /> Edit
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl">
          <Image
            src={restaurant.image || "/fifth.png"} // Use API image or fallback
            alt="Restaurant"
            width={700}
            height={400}
            className="rounded-xl object-cover w-full h-[250px]"
          />
        </div>

        <h3 className="text-xl font-semibold mt-4">{restaurant.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1 gap-2 dark:text-white">
          {/* These can be made dynamic if API provides the data */}
          <FaStar className="text-yellow-500" />
          <span>5.0 (23 Reviews)</span>
          <span>•</span>
          <span>23 Orders</span>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-700 dark:text-white">
          <div>
            <h4 className="font-bold">Established</h4>
            <p className="text-gray-500 dark:text-white">
              {new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <h4 className="font-bold">Description</h4>
            <p className="text-gray-500 dark:text-white">{restaurant.description || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-bold">Working Period</h4>
            <p className="text-gray-500 dark:text-white">{restaurant.openingHours|| 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-bold">Location</h4>
            <p className="text-gray-500 dark:text-white">
              {formatAddress(restaurant.address)}
            </p>
          </div>
        </div>
      </div>

      <div className=" w-1/3 space-y-6">
        {/* --- Step 7: Pass the fetched owner ID to the child component --- */}
        {restaurant.owner? (
            <RestaurantAgentOverview  />
        ) : (
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                No Representative Assigned.
            </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOverviewPage;