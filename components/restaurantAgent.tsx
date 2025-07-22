// FILE: app/components/RestaurantAgentOverview.tsx

"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./loadingSpinner"; // Make sure this path is correct
import { OwnerFromAPI } from "../types/owner"; // Make sure this path to your types is correct

// --- Step 1: Define the props this component now receives ---
interface AgentOverviewProps {
  ownerId: string;
}

// --- Step 2: This is a "smart" component that fetches its own data ---
const RestaurantAgentOverview: React.FC<AgentOverviewProps> = ({ ownerId }) => {
  const [owner, setOwner] = useState<OwnerFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Step 3: Use the `ownerId` prop to fetch data ---
  useEffect(() => {
    // Don't fetch if the ownerId is not provided
    if (!ownerId) {
      setError("Owner ID was not provided.");
      setLoading(false);
      return;
    }

    const fetchOwnerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/owner/${ownerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch representative details.");
        
        const data = await response.json();
        // The owner data might be nested inside an 'owner' key
        setOwner(data.owner || data);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [ownerId]); // The effect re-runs whenever the ownerId prop changes

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center dark:bg-gray-800"><LoadingSpinner /></div>;
  if (error) return <div className="bg-white p-6 rounded-xl shadow-md text-red-500 dark:bg-gray-800">{error}</div>;
  if (!owner) return <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">Representative not found.</div>;

  return (     
      <div className="w-full space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center dark:bg-gray-800">
          <h3 className="font-medium text-gray-700 dark:text-white mb-4">Representative Info</h3>
          <div className="flex justify-center mb-2">
            <Image
              src={owner?.user?.image || "/default-avatar.png"}
              alt={owner?.user?.names || 'Representative Avatar'}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <p className="text-lg font-semibold dark:text-white">{owner?.user?.names}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">{owner.businessName}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">{owner?.user?.email}</p>
        </div>
      </div>
  );
};

export default RestaurantAgentOverview;