'use client';
import React, { useState } from "react";

import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";

import clsx from "clsx";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Order } from "../../../../types/order";



const orders: Order[] = [
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 90.0, status: "Delivered", customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' } },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 75.0, status: "Cancelled" , customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' }},
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 110.0, status: "Cancelled", customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' } },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 80.0, status: "Delivered", customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' } },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 80.0, status: "Cancelled" , customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' }},
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 30.0, status: "Delivered", customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' } },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 70.0, status: "Cancelled" , customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' }},
];

const filters = ["All", "This Week", "This Month", "This Year"];

export default function OrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  const applyFilter = () => {
    const result = orders.filter((order) => {
      const inRange = order.price >= priceRange[0] && order.price <= priceRange[1];
      const matchStatus = selectedStatus ? order.status === selectedStatus : true;
      return inRange && matchStatus;
    });
    setFilteredOrders(result);
    setShowFilter(false);
  };

  const clearFilter = () => {
    setPriceRange([0, 200]);
    setSelectedStatus("");
    setFilteredOrders(orders);
    setShowFilter(false);
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={clsx(
              "px-4 py-2 rounded-md text-sm",
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Search + Filter + Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <IoSearch className="absolute top-2.5 left-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-md"
          >
            <FiFilter />
            Filter
          </Button>
        
        </div>
      </div>

      {/* Floating Filter Panel */}
      {showFilter && (
        <div className="absolute top-40 right-6 z-50 bg-white p-5 rounded-xl shadow-lg w-72 border">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Filter</h3>

          {/* Price Range */}
          <label className="block text-sm mb-1">Price Range</label>
          <div className="flex justify-between text-sm mb-2 text-gray-600">
            <span>₵ {priceRange[0]}</span>
            <span>₵ {priceRange[1]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input  title="ff"
              type="range"
              min="0"
              max="200"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-full accent-black"
            />
            <Input  title="ff"
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full accent-black"
            />
          </div>

          {/* Status Dropdown */}
          <label className="block text-sm mt-4 mb-1">Status</label>
          <select  title="ff"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={clearFilter}
              className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100"
            >
              Clear
            </Button>
            <Button
              onClick={applyFilter}
              className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3"><input  title="ff" type="checkbox" /></th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Details</th>
              <th className="p-3">Date</th>
              <th className="p-3">Price <span className="text-xs">↑↓</span></th>
              <th className="p-3">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-3"><input title="ff" type="checkbox" /></td>
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3 truncate">{order.details}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">₵ {order.price.toFixed(2)}</td>
                <td className="p-3">
                  <span className={clsx(
                    "text-sm font-medium",
                    order.status === "Delivered" ? "text-green-600" : "text-red-500"
                  )}>
                    {order.status}
                  </span>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>1 of 9</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              className={clsx(
                "px-3 py-1 rounded-md",
                page === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
              )}
            >
              {page}
            </Button>
          ))}
          <span className="px-2 text-gray-500">›</span>
        </div>
      </div>
    </div>
  );
}