"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Restaurant } from "../../../../types/restaurant";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';

interface FileInputProps {
  label: string;
  id: string;
  file: File | null | undefined;
  onFileChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, file, onFileChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <input
      id={id}
      type="file"
      onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
    />
    {file && <p className="text-xs mt-1 text-gray-600">Current file: {file.name}</p>}
  </div>
);

const EditRestaurantPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Restaurant>({
    
    restaurantName: "",
    representativeName: "",
    phoneNumber: "",
    rating: "",
    businessLicenseFile: null,
    ownerNIDFile: null,
    established: "",
    workingPeriod: "",
    payment: "",
    location: "",
    restaurantImageFile: null,
    
    
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // In a real application, you would get the restaurant ID from the URL
        // const { id } = useParams();
        // const response = await fetch(`/api/restaurants/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockRestaurant: Restaurant = {
          
          restaurantName: "Sun Valley Restaurant",
          representativeName: "Darrell Steward",
          phoneNumber: "+23301532548623",
          rating: "4.5",
          businessLicenseFile: null,
          ownerNIDFile: null,
          established: "2020-05-15",
          workingPeriod: "9:00 AM – 10:00 PM",
          payment: "Mobile Money",
          location: "G. P. O., Asafotase Nettey Road, Accra",
          restaurantImageFile: null,
          
          
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormData(mockRestaurant);
      } catch (err) {
        setError('Failed to load restaurant data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (field: keyof Restaurant, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real application, you would make an API call here
      // const response = await fetch(`/api/restaurants/${formData.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Update failed');
      
      // Redirect after successful update
      router.push('/admin/restaurant-list');
    } catch (error) {
      console.error('Update failed:', error);
      setError('Failed to update restaurant. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md text-center">
        <p>Loading restaurant data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md text-center text-red-500">
        <p>{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-5">
      <h2 className="text-xl font-semibold">Edit Restaurant</h2>

      {/* Restaurant Image Upload */}
      <div className="border border-dashed border-blue-400 p-4 rounded-md text-center">
        <p className="text-blue-500">+ Update Photo</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <label htmlFor="restaurantImageFile" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            + Restaurant Image
          </label>
          <input
            id="restaurantImageFile"
            type="file"
            onChange={(e) => handleFileChange("restaurantImageFile", e.target.files?.[0] || null)}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => handleFileChange("restaurantImageFile", null)}
            variant="ghost"
          >
            Remove
          </Button>
        </div>
        {formData.restaurantImageFile && (
          <p className="mt-2 text-sm text-gray-600">{formData.restaurantImageFile.name}</p>
        )}
      </div>

      {/* Restaurant Info */}
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <Input
          id="restaurantName"
          type="text"
          value={formData.restaurantName}
          onChange={handleChange}
          placeholder="Sun valley restaurant"
          className="w-full mt-1 p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="representativeName" className="block text-sm font-medium">Representative Name</label>
        <Input
          id="representativeName"
          type="text"
          value={formData.representativeName}
          onChange={handleChange}
          placeholder="Darrell Steward"
          className="w-full mt-1 p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="(+233) 01532548623"
          className="w-full mt-1 p-2 border rounded"
          required
        />
      </div>

      {/* Rating Field */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
        <Input
          id="rating"
          type="text"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Enter rating"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* Document Uploads */}
      <FileInput
        id="businessLicense"
        label="Business License"
        file={formData.businessLicenseFile ?? null}
        onFileChange={(file) => handleFileChange("businessLicenseFile", file)}
      />
      <FileInput
        id="ownerNID"
        label="Owner NID"
        file={formData.ownerNIDFile ?? null}
        onFileChange={(file) => handleFileChange("ownerNIDFile", file)}
      />

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="established" className="block text-sm font-medium">Established</label>
          <Input
            id="established"
            type="date"
            value={formData.established}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="workingPeriod" className="block text-sm font-medium">Working Period</label>
          <select
            id="workingPeriod"
            value={formData.workingPeriod}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select working period</option>
            <option value="9:00 AM – 10:00 PM">9:00 AM – 10:00 PM</option>
            <option value="8:00 AM – 9:00 PM">8:00 AM – 9:00 PM</option>
          </select>
        </div>
        <div>
          <label htmlFor="payment" className="block text-sm font-medium">Payment</label>
          <select
            id="payment"
            value={formData.payment}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select payment method</option>
            <option value="Cash in hand">Cash in hand</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <Input
          id="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="G. P. O., Asafotase Nettey Road, Accra..."
          className="w-full mt-1 p-2 border rounded"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => router.push('/admin/restaurant-list')}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Restaurant
        </Button>
      </div>
    </form>
  );
};

export default EditRestaurantPage;