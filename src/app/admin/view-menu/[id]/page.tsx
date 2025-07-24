"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Switch } from "@headlessui/react";
import { ChevronDown, Star } from "lucide-react";
import { Button } from '../../../../../components/Button';
import toast from 'react-hot-toast';

// Define the detailed interface for a single food item from the API
interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  // Assuming ratings and reviews would be part of the detailed fetch in the future
  // ratings: any[]; 
  // reviews: any[];
}

const FoodDetails = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Get the food item ID from the URL

  // State for the food item, loading, and error handling
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded data for reviews and ratings until the API provides them
  const ratings = [
    { stars: 5, count: 23 }, { stars: 4, count: 13 }, { stars: 3, count: 3 },
    { stars: 2, count: 13 }, { stars: 1, count: 39 },
  ];
  const reviews = [
    { user: "Ralph Edwards", rating: 5, comment: "I'm very much happy. Food is good.", date: "Fri, Nov 28 • 12:30 PM", avatar: "/images/profile.jpg" },
  ];
  
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
  });

  // Fetch the food item details from the API when the component mounts
  useEffect(() => {
    if (!id) return;

    const fetchFoodItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/menu/${id}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch food details.');
        }

        const data = await response.json();
        setFoodItem(data.menuItem);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id,apiBaseUrl]);

  // Function to handle toggling the availability status
  const handleAvailabilityChange = useCallback(async (isAvailable: boolean) => {
    if (!foodItem) return;

    // Optimistically update the UI
    setFoodItem({ ...foodItem, isAvailable });

    try {
      const response = await fetch(`${apiBaseUrl}/menu/${foodItem._id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }
      
      toast.success(`Food item has been ${isAvailable ? 'activated' : 'deactivated'}.`);

    } catch (err) {
      // Revert the UI change on failure
      setFoodItem({ ...foodItem, isAvailable: !isAvailable });
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(message);
    }
  }, [foodItem,apiBaseUrl]);


  // Show loading state
  if (loading) {
    return <div className="p-6 text-center">Loading food details...</div>;
  }

  // Show error state
  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }
  
  // Show message if no food item is found
  if (!foodItem) {
    return <div className="p-6 text-center">Food item not found.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-semibold">Food Details</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Available</span>
          <Switch
            checked={foodItem.isAvailable}
            onChange={handleAvailabilityChange}
            className={`${
              foodItem.isAvailable ? "bg-green-500" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span
              className={`${
                foodItem.isAvailable ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
          <Button onClick={() => router.push(`/admin/edit-menu/${foodItem._id}`)} className="bg-blue-600 text-white px-4 py-1.5 rounded">
            Edit
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-10">
        {/* Left Side: Food Info */}
        <div className="w-full lg:w-1/2">
          <Image
            src={foodItem.image || "/images/pizza.jpg"} // Fallback image
            alt={foodItem.name}
            width={500}
            height={300}
            className="rounded-lg object-cover w-full h-80"
          />
          <h2 className="text-xl font-bold mt-4">{foodItem.name}</h2>
          <p className="text-lg font-semibold text-gray-700">
            €{foodItem.price.toFixed(2)}{" "}
            <span className="text-sm text-gray-500"> ⭐ 5.0 (23 Reviews) • 23 Sales</span>
          </p>
          <div className="mt-4">
            <h3 className="font-medium">Details</h3>
            <p className="text-sm text-gray-600">
              {foodItem.description}
            </p>
          </div>
        </div>

        {/* Right Side: Ratings and Reviews */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-3xl font-bold">5.0</p>
            <p className="text-gray-600">/5.0</p>
          </div>

          {/* This section remains static until API provides rating data */}
          {ratings.map((r) => (
            <div key={r.stars} className="flex items-center gap-2 text-sm mb-1">
              <span className="text-yellow-500 flex">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${r.count * 2}%` }}
               />
              </div>
              <span className="text-gray-600 text-xs w-5 text-right">{r.count}</span>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <h3 className="font-semibold">Review & Ratings</h3>
            <div className="flex items-center gap-2 border px-2 py-1 rounded cursor-pointer">
              <span className="text-sm">Ratings</span>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="border-b pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <Image
                    src={r.avatar}
                    alt={r.user}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-sm">{r.user}</span>
                  <span className="text-yellow-500 flex ml-2">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({r.rating}.0)</span>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <div className="text-xs text-gray-400 mt-1">{r.date}</div>
                <Button className="text-xs text-blue-600 mt-1">↪ Reply</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;