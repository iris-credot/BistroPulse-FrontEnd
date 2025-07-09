'use client';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { FaEye } from 'react-icons/fa';

import { useState } from 'react';



type OrderStatus = 'Pending' | 'Preparing' | 'Cancelled' | 'Delivered' | 'On the way';

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    avatar: string;
  };
  price: number;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Dianne Russell', avatar: 'https://i.pravatar.cc/40?img=1' },
    price: 90,
    status: 'Pending',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/40?img=2' },
    price: 75,
    status: 'Preparing',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Ralph Edwards', avatar: 'https://i.pravatar.cc/40?img=3' },
    price: 110,
    status: 'Cancelled',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' },
    price: 80,
    status: 'Delivered',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Kathryn Murphy', avatar: 'https://i.pravatar.cc/40?img=5' },
    price: 80,
    status: 'On the way',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Jenny Wilson', avatar: 'https://i.pravatar.cc/40?img=6' },
    price: 30,
    status: 'Pending',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Jacob Jones', avatar: 'https://i.pravatar.cc/40?img=7' },
    price: 70,
    status: 'Preparing',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Courtney Henry', avatar: 'https://i.pravatar.cc/40?img=8' },
    price: 60,
    status: 'Cancelled',
  },
  {
    id: 'B13789',
    date: 'Feb 08, 2022',
    customer: { name: 'Floyd Miles', avatar: 'https://i.pravatar.cc/40?img=9' },
    price: 79,
    status: 'Delivered',
  },
];

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-yellow-500',
  Preparing: 'text-blue-500',
  Cancelled: 'text-red-500',
  Delivered: 'text-green-500',
  'On the way': 'text-cyan-500',
};

const CustomerOrder: NextPage = () => {
    const [showFilter, setShowFilter] = useState(false);
const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
const [selectedStatus, setSelectedStatus] = useState<string>('');
const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  return (
    <>
      <Head>
        <title>Orders Dashboard</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="relative p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Search" className="border px-2 py-1 rounded" />
              <button
  onClick={() => setShowFilter(!showFilter)}
  className="border px-3 py-1 rounded bg-gray-100"
>
  Filter
</button>

              <button className="border px-3 py-1 rounded bg-gray-100">Export ▼</button>
            </div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'].map(tag => (
              <button key={tag} className="px-3 py-1 text-sm border rounded-full">
                {tag}
              </button>
            ))}
          </div>
{showFilter && (
  <div className="absolute top-16 right-10 z-50 bg-white p-5 rounded-xl shadow-lg w-72 border">
    <h3 className="text-lg font-semibold mb-4 text-blue-600">Filter</h3>

    {/* Price Range */}
    <label className="block text-sm mb-1">Price Range</label>
    <div className="flex justify-between text-sm mb-2 text-gray-600">
      <span>GHC {priceRange[0]}</span>
      <span>GHC {priceRange[1]}</span>
    </div>
    <div className="flex items-center space-x-2">
      <input  title="ff"
        type="range"
        min="0"
        max="1000"
        value={priceRange[0]}
        onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
        className="w-full accent-black"
      />
      <input  title="ff"
        type="range"
        min="0"
        max="1000"
        value={priceRange[1]}
        onChange={e => setPriceRange([priceRange[0], +e.target.value])}
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
      {['Pending', 'Preparing', 'Cancelled', 'Delivered', 'On the way'].map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>

    {/* Buttons */}
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => {
          setPriceRange([0, 1000]);
          setSelectedStatus('');
          setFilteredOrders(orders);
        }}
        className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100"
      >
        Clear Filter
      </button>
      <button
        onClick={() => {
          const filtered = orders.filter(order =>
            order.price >= priceRange[0] &&
            order.price <= priceRange[1] &&
            (selectedStatus ? order.status === selectedStatus : true)
          );
          setFilteredOrders(filtered);
          setShowFilter(false);
        }}
        className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Filter
      </button>
    </div>
  </div>
)}


          <table className="w-full table-auto border text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3"><input title='ff' type="checkbox" /></th>
                <th className="p-3">Order id</th>
                <th className="p-3">Date</th>
                <th className="p-3">Restaurant</th>
                <th className="p-3">Price ↑↓</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3"><input title='vv' type="checkbox" /></td>
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={order.customer.avatar} alt={order.customer.name} className="w-6 h-6 rounded-full" />
                      <span>{order.customer.name}</span>
                    </div>
                  </td>
                  <td className="p-3">₵ {order.price.toFixed(2)}</td>
                  <td className={`p-3 font-medium ${statusColor[order.status]}`}>{order.status}</td>
                  <td className="p-3">
                     <Link href={'/admin/order-overview'}>
    <FaEye className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm">
            <span>1 of 2</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(p => (
                <button key={p} className={`px-2 py-1 rounded ${p === 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CustomerOrder;
