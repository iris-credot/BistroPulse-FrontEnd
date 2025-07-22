"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';

// Simplified interface: we only need the owner's ID and name for the dropdown.
interface FormattedRepresentative {
  owner: string;
  name: string;
}

// Detailed types for the raw API response for type safety
interface ApiUser {
  _id: string;
  names: string;
}

interface ApiOwner {
  _id: string;
  user: ApiUser;
}
interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const AddRestaurantForm: React.FC = () => {
  const router = useRouter();

  // Form input states
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workingPeriod, setWorkingPeriod] = useState("");
   const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [image, setImage] = useState<File | null>(null);

  // State for representatives dropdown
  const [representatives, setRepresentatives] = useState<FormattedRepresentative[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  
  // Loading and messaging states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repLoadingError, setRepLoadingError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authorization token not found.");

        const response = await fetch("https://bistroupulse-backend.onrender.com/api/owner", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch representatives.");

        const data = await response.json();
        console.log(data);
        const ownersArray: ApiOwner[] = data.owners;
        if (!Array.isArray(ownersArray)) {
          throw new Error("Invalid data format for representatives.");
        }

        // Simplified data transformation. We only need the owner's ID and their user's name.
        const formattedData = ownersArray.map(owner => ({
          owner: owner._id,
          name: owner.user.names
        }));
        
        setRepresentatives(formattedData);

      } catch (error) {
        setRepLoadingError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    };

    fetchRepresentatives();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
        // ========= THE FINAL FIX IS HERE =========
        // 1. Get the logged-in user's data from localStorage.
        const userString = localStorage.getItem('user');
        if (!userString) {
            throw new Error("Login session expired or user data not found. Please log in again.");
        }

        // 2. Parse the user data and get their ID.
        
        const loggedInUserId = localStorage.getItem('userId');

        if (!loggedInUserId) {
            throw new Error("User ID is missing from local data. Please log in again.");
        }
        // ========= END OF FIX =========

        const formData = new FormData();
        // 3. Append BOTH the logged-in user's ID and the selected owner's ID.
        formData.append("user", loggedInUserId);
        formData.append("owner", selectedOwnerId);
        
        // Append the rest of the form data
        formData.append("name", restaurantName);
        formData.append("email", email);
        formData.append("phone", phoneNumber);
        formData.append("description", description);
        formData.append("openingHours", workingPeriod);
        Object.entries(address).forEach(([key, value]) => {
        if (value) { // Only append fields that have a value
          formData.append(`address[${key}]`, value);
        }
      });
        if (image) formData.append("image", image);

      const token = localStorage.getItem('token');
      const response = await fetch("https://bistroupulse-backend.onrender.com/api/restaurant", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        console.error("Backend Error Response:", errorData);
        throw new Error(errorData.message || "An unknown error occurred during submission.");
      }

      setSubmitMessage("Restaurant added successfully! Redirecting...");
      setTimeout(() => router.back(), 1500);

    } catch (error) {
      setSubmitMessage(error instanceof Error ? `Failed to add restaurant: ${error.message}` : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md space-y-5 dark:bg-gray-800">
      <h2 className="text-xl font-semibold">Add Restaurant</h2>

      {/* Image Upload Section */}
      <div className="border border-dashed border-blue-400 p-4 rounded-md text-center">
        <p className="text-blue-500">+ Add Photo</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
          <input type="file" id="restaurantImage" className="hidden" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
          <label htmlFor="restaurantImage" className={`w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:text-black cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            + Restaurant Image
          </label>
          {image && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{image.name}</span>
              <Button type="button" onClick={() => setImage(null)} className="w-full sm:w-auto text-red-500" disabled={isSubmitting}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Representative Name Dropdown */}
      <div>
        <label htmlFor="owner" className="block text-sm font-medium">Representative Names</label>
        <select id="owner" className="w-full mt-1 p-2 border rounded dark:bg-gray-950 dark:text-white" value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)} required disabled={isSubmitting || representatives.length === 0}>
          <option value="">
            {repLoadingError ? repLoadingError : (representatives.length === 0 ? "Loading..." : "Select a representative")}
          </option>
          {representatives.map((rep) => (
            <option key={rep.owner} value={rep.owner}>{rep.name}</option>
          ))}
        </select>
      </div>

      {/* Other Form Inputs... */}
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <Input id="restaurantName" type="text" placeholder="Sun valley restaurant" className="w-full mt-1 p-2 border rounded" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <Input id="email" type="email" placeholder="example@gmail.com" className="w-full mt-1 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Input id="description" type="text" placeholder="A brief description of the restaurant." className="w-full mt-1 p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
        <Input id="phone" type="tel" placeholder="(+233) 01532548623" className="w-full mt-1 p-2 border rounded" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="openingHours" className="block text-sm font-medium">Working Period</label>
          <select id="openingHours" className="w-full mt-1 p-2 border rounded dark:bg-gray-950 dark:text-gray-500" value={workingPeriod} onChange={(e) => setWorkingPeriod(e.target.value)} required disabled={isSubmitting}>
            <option value="">Select working period</option>
            <option>9:00 AM – 10:00 PM</option>
            <option>8:00 AM – 9:00 PM</option>
          </select>
        </div>
      </div>
       <div>
        <label htmlFor="city" className="block text-sm font-medium">City</label>
        <Input
          id="city"
          name="city"
          type="text"
          placeholder="Accra..."
          className="w-full mt-1 p-2 border rounded"
          value={address.city}
          onChange={handleAddressChange}
          required
          disabled={isSubmitting}
        />
      </div>
      
      {submitMessage && <p className="text-center text-sm text-gray-600 dark:text-gray-400">{submitMessage}</p>}

      <Button type="submit" className="w-full sm:w-auto bg-blue-600 text-white dark:text-black px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Restaurant'}
      </Button>
    </form>
  );
};

export default AddRestaurantForm;