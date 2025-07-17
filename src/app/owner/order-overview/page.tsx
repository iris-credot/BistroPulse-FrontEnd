"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Button } from '../../../../components/Button';

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b dark:border-gray-700 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Id #12009</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">On the way</span>
              <span className="text-gray-400">Ralph Edwards</span>
              <span>• Sat, Nov 28 • 08:30 PM</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <select title="Assign Deliveryman" className="border rounded px-3 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Assign Deliveryman</option>
            </select>
            <Button className="border px-3 py-1 rounded dark:border-gray-600 dark:text-black dark:hover:bg-gray-700">Payment</Button>
            <Button className="border px-3 py-1 rounded dark:border-gray-600 dark:text-black dark:hover:bg-gray-700">Status</Button>
          </div>
        </div>

        {/* Status and Tracking */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">Order Status</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>✅ Placed - 10:34 AM</li>
              <li>✅ Accepted - 10:36 AM</li>
              <li>✅ Being prepared - 10:37 AM</li>
              <li>✅ On the way - 10:50 AM</li>
              <li className="text-gray-400 dark:text-gray-500">⬜ Delivered - 00:00</li>
            </ul>
          </div>

          {/* Map */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Order Tracking</h3>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              {/* This is a placeholder, you would replace it with a real map component */}
              <Image
                src="/images/map-placeholder.png"
                alt="Map"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Estimated delivery time 12:45:10</p>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold border-b dark:border-gray-700 pb-2 mb-4 dark:text-white">Summary</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <div>Beef onion pizza (2 items)</div>
              <div>₵ 80.00</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Cheese pizza (1 item)</div>
              <div>₵ 30.00</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Cheese pizza (1 item)</div>
              <div>₵ 30.00</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Cheese pizza (1 item)</div>
              <div>₵ 30.00</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Coupon Code: <span className="text-gray-800 dark:text-white">Not Applied</span></div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Reward Points: <span className="text-gray-800 dark:text-white">Not Used</span></div>
            <div className="flex items-center justify-between font-medium">
              <div>Subtotal</div>
              <div>₵ 165.00</div>
            </div>
            <div className="flex items-center justify-between font-medium">
              <div>Delivery Fee</div>
              <div>₵ 2.40</div>
            </div>
            <div className="flex items-center justify-between font-medium">
              <div>Fees & Estimated Tax</div>
              <div>₵ 1.00</div>
            </div>
            <div className="flex items-center justify-between text-lg font-bold border-t dark:border-gray-700 pt-2 text-gray-800 dark:text-white">
              <div>Total</div>
              <div>GHC 166.00</div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold dark:text-white">Customer Info</h3>
            <div className="flex items-center gap-4">
              <Image
                src="/images/customer.png"
                alt="Customer"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold dark:text-white">Chelsie Jhonson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">chelsiejhonson@bindirigu.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Order 39</p>
              </div>
            </div>
            <p className="flex items-center text-sm text-gray-600 dark:text-gray-400"><Phone size={16} className="mr-2" /> +88 01600-009770</p>
            <p className="flex items-center text-sm text-gray-600 dark:text-gray-400"><MapPin size={16} className="mr-2" /> Asafoatse Nettey Road, Accra</p>
          </div>
        </div>

      </div>
    </div>
  );
}
