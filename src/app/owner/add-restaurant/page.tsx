"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import toast from "react-hot-toast";

// Address interface remains the same
interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const AddRestaurantForm: React.FC = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Form input states
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workingPeriod, setWorkingPeriod] = useState("");
  const [address, setAddress] = useState<Address>({ street: "", city: "", state: "", country: "", zipCode: "" });
  const [image, setImage] = useState<File | null>(null);

  // --- NEW: State for the logged-in owner's details ---
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [ownerLoadingError, setOwnerLoadingError] = useState<string | null>(null);
  
  // Loading and messaging states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NEW: useEffect to fetch the logged-in owner's profile ---
  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (!token || !userString) {
          throw new Error("Authentication failed. Please log in.");
        }
        
        const user = JSON.parse(userString);
        const userId = user?._id;
        if (!userId) {
          throw new Error("Could not find your User ID.");
        }

        const response = await fetch(`${apiBaseUrl}/owner/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch your owner profile. Please ensure it is set up.");
        }

        const data = await response.json();
        const foundOwnerId = data.owner?._id;
        const foundOwnerName = data.owner?.user?.names;

        if (!foundOwnerId || !foundOwnerName) {
            throw new Error("Your owner profile data is incomplete.");
        }

        // Set the fetched data into state
        setOwnerId(foundOwnerId);
        setOwnerName(foundOwnerName);

      } catch (error) {
        setOwnerLoadingError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    };

    fetchOwnerProfile();
  }, [apiBaseUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if the owner ID hasn't been fetched yet
    if (!ownerId) {
        toast.error("Could not submit: Owner details are missing. Please refresh.");
        return;
    }

    setIsSubmitting(true);

    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString!);
      const loggedInUserId = user?._id;
      
      if (!loggedInUserId) {
          throw new Error("Your user ID could not be read. Please log in again.");
      }

      const formData = new FormData();
      formData.append("user", loggedInUserId);
      formData.append("owner", ownerId); // Use the owner ID from state
      formData.append("name", restaurantName);
      formData.append("email", email);
      formData.append("phone", phoneNumber);
      formData.append("description", description);
      formData.append("openingHours", workingPeriod);
      Object.entries(address).forEach(([key, value]) => {
          if (value) formData.append(`address[${key}]`, value);
      });
      if (image) formData.append("image", image);

      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/restaurant`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || "An unknown error occurred during submission.");
      }

      toast.success("Restaurant added successfully! Redirecting...");
      setTimeout(() => router.back(), 1500);

    } catch (error) {
      toast.error(error instanceof Error ? `Failed to add restaurant: ${error.message}` : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md space-y-5 dark:bg-gray-800">
      <h2 className="text-xl font-semibold">Add Restaurant</h2>

      {/* --- NEW: Display Owner Information --- */}
      <div>
        <label className="block text-sm font-medium">Restaurant Owner</label>
        <div className="w-full mt-1 p-3 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            {ownerName ? (
                <p>Adding restaurant for: <strong className="text-blue-600">{ownerName}</strong></p>
            ) : ownerLoadingError ? (
                <p className="text-red-500">{ownerLoadingError}</p>
            ) : (
                <p>Loading your profile...</p>
            )}
        </div>
      </div>
      
      <div className="border border-dashed border-blue-400 p-4 rounded-md text-center">
        <p className="text-blue-500">+ Add Photo</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
          <input type="file" id="restaurantImage" className="hidden" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
          <label htmlFor="restaurantImage" className={`w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            + Restaurant Image
          </label>
          {image && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{image.name}</span>
              <Button type="button" onClick={() => setImage(null)} className="text-red-500" disabled={isSubmitting}>Remove</Button>
            </div>
          )}
        </div>
      </div>

      {/* Other Form Inputs... */}
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <Input id="restaurantName" type="text" placeholder="e.g., The Grand Eatery" className="w-full mt-1 p-2 border rounded" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <Input id="email" type="email" placeholder="e.g., contact@grandeatery.com" className="w-full mt-1 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Input id="description" type="text" placeholder="A brief description of the restaurant." className="w-full mt-1 p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
        <Input id="phone" type="tel" placeholder="e.g., +250 788 123 456" className="w-full mt-1 p-2 border rounded" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="openingHours" className="block text-sm font-medium">Working Period</label>
          <select id="openingHours" className="w-full mt-1 p-2 border rounded dark:bg-gray-950" value={workingPeriod} onChange={(e) => setWorkingPeriod(e.target.value)} required disabled={isSubmitting}>
            <option value="">Select working period</option>
            <option>9:00 AM – 10:00 PM</option>
            <option>8:00 AM – 9:00 PM</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium">City</label>
          <Input id="city" name="city" type="text" placeholder="e.g., Kigali" className="w-full mt-1 p-2 border rounded" value={address.city} onChange={handleAddressChange} required disabled={isSubmitting} />
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting || !ownerId}>
        {isSubmitting ? 'Adding...' : 'Add Restaurant'}
      </Button>
    </form>
  );
};

export default AddRestaurantForm;