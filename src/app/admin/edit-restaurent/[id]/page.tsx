"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../../../../../components/Button";
import { Input } from "../../../../../components/Input";
import { useRouter, useParams } from 'next/navigation';
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../../components/loadingSpinner";
import { Restaurant } from "../../../../../types/restaurant"; // Ensure this type is correctly defined

// Define the shape of the restaurant data expected from the API for editing
type EditableRestaurant = Omit<Restaurant, 'id' | 'owner' | 'rating' | 'representative' | 'createdAt' | 'status'> & {
    address: {
       
        city?: string;
    };
};

const EditRestaurantPage = () => {
    const router = useRouter();
    const params = useParams();
    const restaurantId = Array.isArray(params.id) ? params.id[0] : params.id;

    // State for the form, loading, and errors
    const [restaurant, setRestaurant] = useState<Partial<EditableRestaurant> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null); // State for the new image file
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for the image preview URL
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing restaurant data on component mount
    useEffect(() => {
        if (!restaurantId) {
            setError("Restaurant ID is missing.");
            setLoading(false);
            return;
        }

        const fetchRestaurant = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Authentication token not found.");

                const response = await fetch(`https://bistroupulse-backend.onrender.com/api/restaurant/${restaurantId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch restaurant details.");

                const data = await response.json();
                 if (!data.restaurant) throw new Error("Restaurant data not found in API response.");

                setRestaurant(data.restaurant);
                setImagePreview(data.restaurant.image || "/fifth.png");

            } catch (err) {
                 setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [restaurantId]);

    // Handler for text input changes (including nested address)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!restaurant) return;

        if (name === "street" || name === "city") {
            setRestaurant({
                ...restaurant,
                address: { ...restaurant.address, [name]: value }
            });
        } else {
            setRestaurant({ ...restaurant, [name]: value });
        }
    };

    // Handler for image selection
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    // Handler to remove/reset the image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("/images/placeholder-restaurant.png"); // A default placeholder
    };

    // Handler for saving the changes
    const handleSave = async () => {
        if (!restaurant || !restaurantId) return;
        
        setSaving(true);
        const toastId = toast.loading("Saving restaurant...");

        // Use FormData to send both text and file data
        const formData = new FormData();
        
        // Append all editable fields to FormData
        formData.append("name", restaurant.name || "");
        formData.append("description", restaurant.description || "");
        formData.append("phone", restaurant.phone || "");
        formData.append("openingHours", restaurant.openingHours || "");
        formData.append("address[city]", restaurant.address?.city || "");
        formData.append("address[street]", restaurant.email || "");
        
        // If a new image file was selected, append it
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://bistroupulse-backend.onrender.com/api/restaurant/${restaurantId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData, // Send as FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save changes.");
            }

            toast.success("Restaurant updated successfully!", { id: toastId });
            router.push(`/admin/view-restaurent/${restaurantId}`); // Navigate back to the view page

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    // --- Render logic based on state ---
    if (loading) {
        return <div className="flex justify-center items-center h-[80vh]"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }
    
    if (!restaurant) {
        return <div className="p-6 text-center">Could not load restaurant data.</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Restaurant</h2>

            <div className="flex flex-col items-center mb-6">
                <Image
                    src={typeof imagePreview === "string" && imagePreview.startsWith("blob:") || imagePreview?.startsWith("http") || imagePreview?.startsWith("/") 
  ? imagePreview 
  : "/images/placeholder-restaurant.png"}
                    alt="Restaurant Image"
                    width={160}
                    height={160}
                    className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-gray-700"
                />
                <div className="flex gap-3">
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        Upload Image
                    </label>
                    <Button
                        onClick={handleRemoveImage}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 text-sm font-semibold"
                    >
                        Remove
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Restaurant Name</label>
                        <Input type="text" name="name" value={restaurant.name || ''} onChange={handleInputChange} className="mt-1 w-full" placeholder="e.g., The Grand Bistro"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Phone Number</label>
                        <Input type="text" name="phone" value={restaurant.phone || ''} onChange={handleInputChange} className="mt-1 w-full" placeholder="e.g., +1 234 567 890"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">City</label>
                        <Input type="text" name="city" value={restaurant.address?.city || ''} onChange={handleInputChange} className="mt-1 w-full" placeholder="e.g., New York"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
                        <Input type="text" name="email" value={restaurant.email || ''} onChange={handleInputChange} className="mt-1 w-full" placeholder="example@gmail.com"/>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Opening Hours</label>
                        <Input type="text" name="openingHours" value={restaurant.openingHours || ''} onChange={handleInputChange} className="mt-1 w-full" placeholder="e.g., Mon-Fri, 9am - 10pm"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
                        <textarea name="description" value={restaurant.description || ''} onChange={handleInputChange} rows={6} className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="A brief description of the restaurant..."/>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 mt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 font-semibold" disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default EditRestaurantPage;