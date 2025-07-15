// CuisineSelectionPage.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CuisineSelectionPage() {
  const router = useRouter();
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Available cuisine options
  const cuisineOptions: string[] = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese',
    'Thai', 'Mediterranean', 'American', 'French', 'Vietnamese',
    'Korean', 'Greek', 'Spanish', 'Lebanese', 'Turkish'
  ];

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setFavoriteCuisines(selected);
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (favoriteCuisines.length === 0) {
    toast.error('Please select at least one cuisine');
    return;
  }

  const user = localStorage.getItem('userId'); // 👈 Get user from localStorage

  if (!user) {
    toast.error('User not found. Please log in again.');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('https://bistroupulse-backend.onrender.com/api/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user,
        favoriteCuisines,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save preferences');
    }

    toast.success('Preferences saved successfully!');
    router.push('/login');
  } catch (error) {
    console.error('Error saving preferences:', error);
    toast.error('Failed to save preferences. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded-full">
              <FaUtensils className="text-indigo-600 text-5xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Select Your Favorite Cuisines</h1>
          <p className="text-indigo-200 mt-2">
            Choose the cuisines you love most. This helps us personalize your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Cuisine Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Favorite Cuisines (Select multiple):
            </label>
            <div className="relative">
              <select
              title='d'
                multiple
                value={favoriteCuisines}
                onChange={handleSelectionChange}
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              >
                {cuisineOptions.map((cuisine) => (
                  <option 
                    key={cuisine} 
                    value={cuisine}
                    className="p-2 hover:bg-indigo-50"
                  >
                    {cuisine}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaUtensils className="text-gray-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple options
            </p>
          </div>

          {/* Selected Cuisines Preview */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-2 flex items-center">
              <FaUtensils className="mr-2" /> Your Selections:
            </h3>
            {favoriteCuisines.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteCuisines.map((cuisine) => (
                  <span 
                    key={cuisine} 
                    className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm text-indigo-700"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No cuisines selected yet</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition ${
              favoriteCuisines.length === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } ${isLoading ? 'opacity-80' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Save Preferences & Continue to Login <FaArrowRight />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 max-w-md">
        <p>Your cuisine preferences will be saved to our database.</p>
        <p className="mt-2">After saving, you will be redirected to the login page to access your account.</p>
      </div>
    </div>
  );
}