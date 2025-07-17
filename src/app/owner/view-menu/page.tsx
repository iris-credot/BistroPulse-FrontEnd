"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Switch } from "@headlessui/react";
import { ChevronDown, Star } from "lucide-react";
import { Button } from '../../../../components/Button';

const FoodDetails = () => {
  const [size, setSize] = useState("Medium");
  const [available, setAvailable] = useState(true);

  const ratings = [
    { stars: 5, count: 23 },
    { stars: 4, count: 13 },
    { stars: 3, count: 3 },
    { stars: 2, count: 13 },
    { stars: 1, count: 39 },
  ];

  const reviews = [
    {
      user: "Ralph Edwards",
      rating: 5,
      comment: "I'm very much happy. Food is good.",
      date: "Fri, Nov 28 • 12:30 PM",
      avatar: "/images/profile.jpg",
    },
    {
      user: "Beef onion pizza",
      rating: 5,
      comment: "I'm very much happy. Food is good.",
      date: "Fri, Nov 28 • 12:30 PM",
      avatar: "/images/profile.jpg",
    },
    {
      user: "Beef onion pizza",
      rating: 5,
      comment: "I'm very much happy. Food is good.",
      date: "Fri, Nov 28 • 12:30 PM",
      avatar: "/images/profile.jpg",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-semibold dark:text-white">Food Details</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
          <Switch
            checked={available}
            onChange={setAvailable}
            className={`${
              available ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                available ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
          <Button className="bg-blue-600 text-white px-4 py-1.5 rounded">Edit</Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-10">
        {/* Left Side */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/pizza.jpg"
            alt="Beef onion pizza"
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold mt-4 dark:text-white">Beef onion pizza</h2>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            ₵70.00 <span className="text-sm text-gray-500 dark:text-gray-400"> ⭐ 5.0 (23 Reviews) • 23 Sales</span>
          </p>
          <div className="mt-4">
            <h3 className="font-medium dark:text-white">Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Black olives, onion, mushroom, tomato, jalapeno, extra cheese base
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2 dark:text-white">Size</h3>
            {[
              { label: "Small", price: 70 },
              { label: "Medium", price: 80 },
              { label: "Large", price: 90 },
            ].map((option) => (
              <label key={option.label} className="flex items-center gap-3 mb-2 text-gray-800 dark:text-gray-300">
                <input
                  type="radio"
                  name="size"
                  value={option.label}
                  checked={size === option.label}
                  onChange={() => setSize(option.label)}
                  className="form-radio text-blue-600 bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
                />
                <span>{option.label}</span>
                <span className="ml-auto font-medium text-sm">₵{option.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-3xl font-bold dark:text-white">5.0</p>
            <p className="text-gray-600 dark:text-gray-400">/5.0</p>
          </div>

          {ratings.map((r) => (
            <div key={r.stars} className="flex items-center gap-2 text-sm mb-1">
              <span className="text-yellow-500 flex">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${r.count * 2}%` }}
               />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-xs w-5 text-right">{r.count}</span>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <h3 className="font-semibold dark:text-white">Review & Ratings</h3>
            <div className="flex items-center gap-2 border dark:border-gray-600 px-2 py-1 rounded cursor-pointer">
              <span className="text-sm dark:text-gray-300">Ratings</span>
              <ChevronDown size={16} className="dark:text-gray-300" />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="border-b dark:border-gray-700 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <Image
                    src={r.avatar}
                    alt={r.user}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-sm dark:text-white">{r.user}</span>
                  <span className="text-yellow-500 flex ml-2">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({r.rating}.0)</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{r.comment}</p>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{r.date}</div>
                <Button className="text-xs text-blue-600 mt-1 hover:underline">↪ Reply</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;