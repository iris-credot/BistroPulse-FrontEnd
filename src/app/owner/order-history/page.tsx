'use client';

import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Order } from "../../../../types/order";


const orders: Order[] = [
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 90.0, status: "Delivered",customer: { name: "John Doe", avatar: "" },  },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 75.0, status: "Cancelled",customer: { name: "John Doe", avatar: "" },  },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 110.0, status: "Cancelled",customer: { name: "John Doe", avatar: "" },  },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 80.0, status: "Delivered" ,customer: { name: "John Doe", avatar: "" }, },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 80.0, status: "Cancelled" ,customer: { name: "John Doe", avatar: "" }, },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 30.0, status: "Delivered" ,customer: { name: "John Doe", avatar: "" }, },
  { id: "B13789", details: "Beef onion pizza (2x), Beef burger...", date: "Feb 08, 2022", price: 70.0, status: "Cancelled" ,customer: { name: "John Doe", avatar: "" }, },
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
    <div className="p-6 relative bg-white dark:bg-gray-800 rounded-lg">
      <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Orders</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={clsx(
              "px-4 py-2 rounded-md text-sm",
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search + Filter + Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <IoSearch className="absolute top-2.5 left-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <FiFilter />
            Filter
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm dark:bg-blue-600">
            Export <MdKeyboardArrowDown />
          </Button>
        </div>
      </div>

      {/* Floating Filter Panel */}
      {showFilter && (
        <div className="absolute top-40 right-6 z-50 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-lg w-72 border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Filter</h3>

          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Price Range</label>
          <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
            <span>₵ {priceRange[0]}</span>
            <span>₵ {priceRange[1]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input  title="price-min"
              type="range"
              min="0"
              max="200"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-full accent-black dark:accent-blue-500"
            />
            <Input  title="price-max"
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full accent-black dark:accent-blue-500"
            />
          </div>

          <label className="block text-sm mt-4 mb-1 text-gray-700 dark:text-gray-300">Status</label>
          <select  title="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={clearFilter}
              className="w-1/2 border border-gray-300 py-2 dark:text-black rounded hover:bg-gray-100 dark:border-gray-600  dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <Button
              onClick={applyFilter}
              className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 dark:text-black"
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-3"><input  title="select-all" type="checkbox" className="dark:bg-gray-800 dark:border-gray-600" /></th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Details</th>
              <th className="p-3">Date</th>
              <th className="p-3">Price <span className="text-xs">↑↓</span></th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-300">
                <td className="p-3"><input title={`select-${order.id}`} type="checkbox" className="dark:bg-gray-800 dark:border-gray-600"/></td>
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3 truncate">{order.details}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">₵ {order.price.toFixed(2)}</td>
                <td className="p-3">
                  <span className={clsx(
                    "text-sm font-medium",
                    order.status === "Delivered" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
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
        <div className="flex items-center gap-1 ">
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              className={clsx(
                "px-3 py-1 rounded-md",
                page === 1 ? "bg-blue-600 text-white" : "text-gray-700 dark:text-black hover:bg-gray-200"
              )}
            >
              {page}
            </Button>
          ))}
          <span className="px-2 text-gray-500 dark:text-black">›</span>
        </div>
      </div>
    </div>
  );
}
