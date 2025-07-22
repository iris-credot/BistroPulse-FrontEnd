 "use client";
import Image from "next/image";


import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../../components/loadingSpinner";
import { OwnerFromAPI } from "types/owner";
// --- Step 1: Define the props this component now receives ---
interface AgentOverviewProps {
  ownerId: string;
}

// Define the shape of the owner data from the API

// --- Step 2: Accept the props in the function signature ---
const RestaurantAgentOverview: React.FC<AgentOverviewProps> = ({ ownerId }) => {
  const [owner, setOwner] = useState<OwnerFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Step 3: Use the `ownerId` prop to fetch data ---
  useEffect(() => {
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
        setOwner(data.owner || data);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [ownerId]); // The effect depends on the `ownerId` prop

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center"><LoadingSpinner /></div>;
  if (error) return <div className="bg-white p-6 rounded-xl shadow-md text-red-500">{error}</div>;
  if (!owner) return <div className="bg-white p-6 rounded-xl shadow-md">Representative not found.</div>;

  return (     
      <div className="w-full space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center dark:bg-gray-800">
          <h3 className="font-medium text-gray-700 dark:text-white mb-4">Representative Info</h3>
          <div className="flex justify-center mb-2">
            <Image
              src={owner?.user?.image || "/default-avatar.png"}
              alt='sd'
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <p className="text-lg font-semibold">{owner?.user?.names}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-white">{owner.businessName}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-white">{owner?.user?.email}</p>
        </div>

        
      </div>
  );
};

export default RestaurantAgentOverview;
