"use client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";

import RestaurantAgentOverview from "../view-agentRestau/page";
import React from "react";

const RestaurantOverview: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
  
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Restaurant Overview</h2>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">Open</span>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
              <FiEdit3 /> Edit
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl">
          <Image
            src="/fifth.png"
            alt="Restaurant"
            width={700}
            height={400}
            className="rounded-xl object-cover w-full h-[250px]"
          />
        </div>

        <h3 className="text-xl font-semibold mt-4">Star Vally Restaurant</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
          <FaStar className="text-yellow-500" />
          <span>5.0 (23 Reviews)</span>
          <span>•</span>
          <span>23 Orders</span>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium">Established</h4>
            <p className="text-gray-500">Since 01 January 2024</p>
          </div>
          <div>
            <h4 className="font-medium">Payment Method</h4>
            <p className="text-gray-500">Visa Card</p>
          </div>
          <div>
            <h4 className="font-medium">Working Period</h4>
            <p className="text-gray-500">9:00 AM - 10:00 PM</p>
          </div>
          <div>
            <h4 className="font-medium">Location</h4>
            <p className="text-gray-500">
              G. P. O., Asafotase Nettey Road, Accra...
            </p>
          </div>
        </div>
      </div>

  
      <div className="w-full md:w-[300px] space-y-6">
           <RestaurantAgentOverview />
      
      </div>
    </div>
  );
};

export default RestaurantOverview;
