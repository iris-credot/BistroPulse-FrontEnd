
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { FoodItem } from "../../../../types/foodItem";


// Props for EditFood
type EditFoodProps = {
  food: FoodItem;
  onSave: (updatedFood: FoodItem) => void;
  onClose: () => void;
};

const EditFood: React.FC<EditFoodProps> = ({ food, onSave, onClose }) => {
  const [editedFood, setEditedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (food) setEditedFood(food);
  }, [food]);

  if (!editedFood) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow">Loading food item...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedFood({ ...editedFood, [name]: name === "price" ? parseFloat(value) : value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedFood({ ...editedFood, image: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = () => {
    setEditedFood({ ...editedFood, image: "/images/placeholder-food.jpg" });
  };

  const handleSave = () => {
    if (editedFood) {
      onSave(editedFood);
    }
  };

  return (
    <div className=" bg-white flex-col bg-opacity-50 flex items-center justify-center z-50 p-4 min-h-screen">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Edit Food</h2>

      <div className="flex flex-col items-center mb-6">
        <Image
          src={editedFood.image || "/images/placeholder-food.jpg"}
          alt="Food Image"
          width={120}
          height={120}
          className="w-28 h-28 rounded object-cover mb-3 border-2 border-gray-200"
        />
        <div className="flex gap-2">
          <label className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer">
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            Upload
          </label>
          <Button
            onClick={handleRemoveImage}
            className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            name="name"
            value={editedFood.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter food name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={editedFood.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <Input
            type="number"
            name="price"
            value={editedFood.price}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            title="ds"
            value={editedFood.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Main">Main</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        <Button
          onClick={handleSave}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </Button>
        <Button
          onClick={onClose}
          className="w-full mt-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// ----------- Preview Component for Test -----------

const EditFoodTest = () => {
  const dummyFood: FoodItem = {
    id: 1,
    name: "Grilled Chicken",
    description: "Deliciously seasoned grilled chicken served with veggies.",
    price: 12.99,
    category: "Main",
    image: "/images/placeholder-food.jpg",
  };

  const handleSave = (updatedFood: FoodItem) => {
    console.log("Saved food:", updatedFood);
    alert("Food item saved! Check console for data.");
  };

  const handleClose = () => {
    console.log("Modal closed");
    alert("Edit modal closed.");
  };

  return <EditFood food={dummyFood} onSave={handleSave} onClose={handleClose} />;
};

export default EditFoodTest;
