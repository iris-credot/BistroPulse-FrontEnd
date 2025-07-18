'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';

export default function AddFood() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [category, setCategory] = useState('Pizza');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
 
  const [price, setPrice] = useState('');

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log({ photo, category, name, description,  price });
  };

  return (
    // The max-w-2xl and mx-auto classes already make the container responsive.
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">🍕 Add Food</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload */}
        {/* Stacks vertically on mobile, becomes a row on medium screens (md) and up */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label
            htmlFor="photo"
            className="flex justify-center items-center w-full md:w-40 h-32 border-2 border-dashed border-blue-300 rounded cursor-pointer text-blue-500 text-sm"
          >
            + Add Photo
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          {/* Buttons take full width on mobile and auto width on medium screens and up */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button
              type="button"
              className="bg-blue-600 text-white dark:text-black px-4 py-1 rounded hover:bg-blue-700"
            >
              + Food Image
            </Button>
            <Button
              type="button"
              className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200"
              onClick={() => setPhoto(null)}
            >
              Remove
            </Button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Category</label>
          <select
          title='categories'
            // w-full makes this element responsive by default
            className="w-full border rounded px-3 py-2 dark:bg-gray-900"
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
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Food Name</label>
          <Input
            className="w-full border rounded dark:bg-gray-900 px-3 py-2 dark:text-white"
            placeholder="Cheese Pizza"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 dark:text-white dark:bg-gray-900"
            placeholder="Write ingredients. Separate by comma (,)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

       

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Price</label>
          <Input
            type="text"
            className="w-full border rounded px-3 py-2 dark:text-white dark:bg-gray-900"
            placeholder="GHC 0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white dark:text-black px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Food
          </Button>
        </div>
      </form>
    </div>
  );
}