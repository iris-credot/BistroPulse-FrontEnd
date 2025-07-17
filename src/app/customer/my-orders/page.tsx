'use client';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { FaEye } from 'react-icons/fa';
import { Plus } from "lucide-react";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Order, OrderStatus } from '../../../../types/order';
import { useRouter } from "next/navigation";
import { useState } from 'react'; // Assuming you have a ThemeContext
import Image from 'next/image';

// This is a mock. In a real app, you'd get this from your theme context.



const orders: Order[] = [
    // Your orders data
    { id: 'B13789', date: 'Feb 08, 2022', customer: { name: 'Dianne Russell', avatar: 'https://i.pravatar.cc/40?img=1' }, price: 90, status: 'Pending' },
    { id: 'B13789', date: 'Feb 08, 2022', customer: { name: 'Leslie Alexander', avatar: 'https://i.pravatar.cc/40?img=2' }, price: 75, status: 'Preparing' },
    { id: 'B13789', date: 'Feb 08, 2022', customer: { name: 'Ralph Edwards', avatar: 'https://i.pravatar.cc/40?img=3' }, price: 110, status: 'Cancelled' },
    { id: 'B13789', date: 'Feb 08, 2022', customer: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/40?img=4' }, price: 80, status: 'Delivered' },
    { id: 'B13789', date: 'Feb 08, 2022', customer: { name: 'Kathryn Murphy', avatar: 'https://i.pravatar.cc/40?img=5' }, price: 80, status: 'On the way' },
];

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-yellow-500 dark:text-yellow-400',
  Preparing: 'text-blue-500 dark:text-blue-400',
  Cancelled: 'text-red-500 dark:text-red-400',
  Delivered: 'text-green-500 dark:text-green-400',
  'On the way': 'text-cyan-500 dark:text-cyan-400',
};

const CustomerOrder: NextPage = () => {
   const router = useRouter();
    const [showFilter, setShowFilter] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

    const handleAddOrder = () => {
        router.push('/customer/add-menu');
    };

  return (
    <>
      <Head>
        <title>Orders Dashboard</title>
      </Head>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Orders</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Search" className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="border px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Filter
              </Button>
              <Button title='New Order' onClick={handleAddOrder} className="flex items-center justify-center gap-2 text-white border px-3 py-1 rounded bg-blue-500 hover:bg-blue-600">
                <Plus className="w-5 h-5" /> <span>New Order</span>
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'].map(tag => (
              <Button key={tag} className="px-3 py-1 text-sm border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                {tag}
              </Button>
            ))}
          </div>
          {showFilter && (
            <div className="absolute top-16 right-10 z-50 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-lg w-72 border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Filter</h3>
              <label className="block text-sm mb-1 dark:text-gray-300">Price Range</label>
              <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                <span>GHC {priceRange[0]}</span>
                <span>GHC {priceRange[1]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input  title="price-min-range"
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-full accent-black dark:accent-blue-500"
                />
                <Input  title="price-max-range"
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-black dark:accent-blue-500"
                />
              </div>

              <label className="block text-sm mt-4 mb-1 dark:text-gray-300">Status</label>
              <select  title="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Status</option>
                {['Pending', 'Preparing', 'Cancelled', 'Delivered', 'On the way'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setSelectedStatus('');
                    setFilteredOrders(orders);
                  }}
                  className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear Filter
                </Button>
                <Button
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
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
            <table className="w-full table-auto text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-3"><input title='select-all-orders' type="checkbox" className="dark:bg-gray-800 dark:border-gray-600 rounded" /></th>
                  <th className="p-3">Order id</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Restaurant</th>
                  <th className="p-3">Price ↑↓</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-300">
                {filteredOrders.map((order, i) => (
                  <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-3"><input title={`select-order-${order.id}`} type="checkbox" className="dark:bg-gray-800 dark:border-gray-600 rounded"/></td>
                    <td className="p-3 font-medium dark:text-white">{order.id}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Image src={order.customer.avatar} alt={order.customer.name}  width={24}  height={24} className="rounded-full" />
                        <span className="font-medium dark:text-white">{order.customer.name}</span>
                      </div>
                    </td>
                    <td className="p-3">₵ {order.price.toFixed(2)}</td>
                    <td className={`p-3 font-medium ${statusColor[order.status]}`}>{order.status}</td>
                    <td className="p-3">
                       <Link href={'/admin/order-overview'}>
                         <FaEye className="text-blue-600 dark:text-blue-400 cursor-pointer hover:scale-110 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-400">
            <span>1 of 2</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(p => (
                <button key={p} className={`px-2 py-1 rounded ${p === 1 ? 'bg-black text-white dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
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