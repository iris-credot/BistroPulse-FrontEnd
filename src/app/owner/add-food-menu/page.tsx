'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Ensure useRouter is imported
import LoadingSpinner from '../../../../components/loadingSpinner';

// --- Interface for restaurant data ---
interface Restaurant {
  _id: string;
  name: string;
}

// --- Main Component ---
export default function AddFood() {
  // --- HOOKS ---
  const router = useRouter(); // Initialized for navigation
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- COMPONENT STATE ---
  const [photo, setPhoto] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // --- DATA & LOADING STATE ---
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurant, setRestaurant] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH USER'S RESTAURANTS ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchUserRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          toast.error("Authentication failed. Please log in again.");
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user?._id;
        if (!userId) {
          toast.error("User ID not found.");
          return;
        }

        const ownerResponse = await fetch(`${apiBaseUrl}/owner/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!ownerResponse.ok) throw new Error("Could not fetch owner profile.");

        const ownerData = await ownerResponse.json();
        const ownerId = ownerData.owner?._id;
        if (!ownerId) throw new Error("Could not identify the owner ID.");

        const restaurantsResponse = await fetch(`${apiBaseUrl}/owner/${ownerId}/restaurants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!restaurantsResponse.ok) throw new Error("Failed to fetch restaurants.");

        const data = await restaurantsResponse.json();
        setRestaurants(data.restaurants);

        if (data.restaurants.length > 0) {
          setRestaurant(data.restaurants[0]._id);
        } else {
           toast.error("You must add a restaurant before adding food.");
        }

      } catch (err) {
        toast.error('An error occurred while fetching restaurants.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRestaurants();
  }, [apiBaseUrl]);

  // --- HANDLE PHOTO INPUT CHANGE ---
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  // --- HANDLE FORM SUBMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!photo || !name || !price || !restaurant || !category) {
      toast.error("Please fill in all required fields: image, name, price, restaurant, and category.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append('image', photo);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('restaurant', restaurant);
    formData.append('isAvailable', String(isAvailable));

    try {
      const response = await fetch(`${apiBaseUrl}/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create menu item.');
      }

      const result = await response.json();
      
      // --- SUCCESS: SHOW TOAST AND GO BACK ---
      toast.success(result.message || "Food item added successfully!");
      router.back(); // Navigate to the previous page

    } catch (err) {
      toast.error('An unexpected error occurred.');
      console.error('Error creating menu item:', err);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  // --- RENDER COMPONENT ---
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">🍕 New Food Menu</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
         {/* Upload Section */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="photo"
            className="flex justify-center items-center w-40 h-32 border-2 border-dashed border-blue-300 dark:border-gray-600 rounded cursor-pointer text-blue-500 dark:text-gray-400  text-sm"
          >
            {photo ? <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover rounded"/> : "+ Add Photo"}
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange} // handlePhotoChange is used here
              className="hidden"
            />
          </label>
           <div className="flex flex-col gap-2">
            <Button
              type="button"
               onClick={() => document.getElementById('photo')?.click()}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 dark:bg-gray-700"
            >
              {photo ? 'Change Image' : '+ Food Image'}
            </Button>
            {photo && (
               <Button
                type="button"
                className="bg-gray-100  px-4 py-1 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => setPhoto(null)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Restaurant Selection */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant</label>
            <select
                title='restaurants'
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                disabled={restaurants.length === 0 || isSubmitting}
            >
                {restaurants.length > 0 ? (
                    restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)
                ) : (
                    <option>No restaurants found</option>
                )}
            </select>
        </div>

        {/* Category (Updated Options) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            title='categories'
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            <option>Main Course</option>
            <option>Appetizer</option>
            <option>Dessert</option>
            <option>Drinks</option>
          </select>
        </div>

        {/* Food Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700  dark:text-white mb-1">Food Name</label>
          <Input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700  dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="e.g., Margherita Pizza"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 dark:bg-gray-700  dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="e.g., Fresh tomatoes, mozzarella, basil"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
          <Input
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="e.g., 12.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is Available?
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input title='f' type="checkbox" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} className="sr-only peer" disabled={isSubmitting} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-gray-600"
            disabled={isSubmitting || restaurants.length === 0}
          >
            {isSubmitting ? 'Adding...' : 'Add Food'}
          </Button>
        </div>
      </form>
    </div>
  );
}