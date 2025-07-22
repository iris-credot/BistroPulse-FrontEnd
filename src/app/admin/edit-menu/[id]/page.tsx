"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from '../../../../../components/Button';
import { Input } from '../../../../../components/Input';
import toast from 'react-hot-toast';

// Assuming your type is in a shared location
// If not, define it here
interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean; // Keep this for data consistency
}

const EditFoodPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the new image file
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (isFormData: boolean = false) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  // Fetch existing food data
  useEffect(() => {
    if (!id) return;
    const fetchFoodItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://bistroupulse-backend.onrender.com/api/menu/${id}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch food item data.");
        }
        const data = await response.json();
        setFoodItem(data.menuItem);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItem();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }
  
  if (!foodItem) {
    return <div className="p-6 text-center">Food item not found.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFoodItem({ ...foodItem, [name]: name === "price" ? parseFloat(value) || 0 : value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the file object
      setFoodItem({ ...foodItem, image: URL.createObjectURL(file) }); // Show a preview
    }
  };
  
  const handleSave = async () => {
    if (!foodItem) return;

    // Use FormData to handle both file uploads and other data
    const formData = new FormData();
    formData.append('name', foodItem.name);
    formData.append('description', foodItem.description);
    formData.append('price', foodItem.price.toString());
    formData.append('category', foodItem.category);
    if (imageFile) {
      formData.append('image', imageFile); // Append the new image if one was selected
    }

    try {
      const response = await fetch(`https://bistroupulse-backend.onrender.com/api/menu/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(true), // Pass true to signal FormData content type
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save changes.');
      }
      
      toast.success('Food item updated successfully!');
      router.push('/admin/food-management'); // Redirect after saving

    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Food Item</h2>

      <div className="flex flex-col items-center mb-6">
        <Image
          src={foodItem.image || "/images/placeholder-food.jpg"}
          alt="Food Image Preview"
          width={120}
          height={120}
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-gray-600"
        />
        <div className="flex gap-4">
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer">
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            Upload New Image
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Name</label>
          <Input
            type="text"
            name="name"
            value={foodItem.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter food name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
          <textarea
            name="description"
            value={foodItem.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Price (€)</label>
          <Input
            type="number"
            name="price"
            value={foodItem.price}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Category</label>
          <select
            name="category"
            title="Category"
            value={foodItem.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Main">Main</option>
            <option value="Dessert">Dessert</option>
            <option value="Drinks">Drinks</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <Button
              onClick={() => router.back()} // Go back to the previous page
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </Button>
        </div>
      </div>
    </div>
  );
};

export default EditFoodPage;