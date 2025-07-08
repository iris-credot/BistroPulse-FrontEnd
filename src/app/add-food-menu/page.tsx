'use client';

import { useState, ChangeEvent } from 'react';

export default function AddFood() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [category, setCategory] = useState('Pizza');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasDifferentSize, setHasDifferentSize] = useState(false);
  const [price, setPrice] = useState('');

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log({ photo, category, name, description, hasDifferentSize, price });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">🍕 Add Food</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="photo"
            className="flex justify-center items-center w-40 h-32 border-2 border-dashed border-blue-300 rounded cursor-pointer text-blue-500 text-sm"
          >
            + Add Photo
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              + Food Image
            </button>
            <button
              type="button"
              className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200"
              onClick={() => setPhoto(null)}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
          title='categories'
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Pizza</option>
            <option>Burger</option>
            <option>Salad</option>
            <option>Drink</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Cheese Pizza"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Write ingredients. Separate by comma (,)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasDifferentSize}
            onChange={(e) => setHasDifferentSize(e.target.checked)}
            id="hasDifferentSize"
            className="w-4 h-4"
          />
          <label htmlFor="hasDifferentSize" className="text-sm text-gray-700">
            Have a different size
          </label>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="GHC 0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Food
          </button>
        </div>
      </form>
    </div>
  );
}
