"use client";
import Image from "next/image";
import { Button } from '../../../../components/Button';

import { MdDownload } from "react-icons/md";
import React from "react";

const RestaurantAgentOverview: React.FC = () => {
  return (     
      <div className="w-full md:w-[500px] space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center dark:bg-gray-800">
          <h3 className="font-medium text-gray-700 dark:text-white mb-4">Representative Info</h3>
          <div className="flex justify-center mb-2">
            <Image
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <p className="text-lg font-semibold">Chelsie Jhonson</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-white">(480) 555-0103</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-white">
            Asafotase Nettey Road, Accra...
          </p>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
          <h3 className="font-medium text-gray-700 mb-4 dark:text-white">Documents</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-2 hover:shadow-sm">
              <div>
                <p className="font-medium text-blue-600 dark:text-white">License</p>
                <p className="text-sm text-gray-500 dark:text-white">Businesslicense.pdf</p>
              </div>
              <Button className="text-gray-500 hover:text-gray-700 " aria-label="Download License">
                <MdDownload size={20} />
              </Button>
            </div>
            <div className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-2 hover:shadow-sm">
              <div>
                <p className="font-medium text-blue-600 dark:text-white">NID Card</p>
                <p className="text-sm text-gray-500 dark:text-white">Nidcard.pdf</p>
              </div>
              <Button className="text-gray-500 hover:text-gray-700" aria-label="Download NID Card">
                <MdDownload size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default RestaurantAgentOverview;
