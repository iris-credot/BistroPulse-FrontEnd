"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Restaurant {
  restaurantName: string;
  representativeName: string;
  phoneNumber: string;
  businessLicenseFile?: File | null;
  ownerNIDFile?: File | null;
  established: string; // "2024-01-01"
  workingPeriod: string;
  payment: string;
  location: string;
  restaurantImageFile?: File | null;
}

interface EditRestaurantFormProps {
  restaurant?: Restaurant; // optional initial data
  onSave: (updatedRestaurant: Restaurant) => void;
}

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

const EditRestaurantForm: React.FC<EditRestaurantFormProps> = ({ restaurant, onSave }) => {
  const [formData, setFormData] = useState<Restaurant>({
    restaurantName: "",
    representativeName: "",
    phoneNumber: "",
    businessLicenseFile: null,
    ownerNIDFile: null,
    established: "",
    workingPeriod: "",
    payment: "",
    location: "",
    restaurantImageFile: null,
  });

  useEffect(() => {
    if (restaurant) {
      setFormData(restaurant);
    }
  }, [restaurant]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (id: keyof Restaurant, file: File | null) => {
    setFormData((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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
          <button
            type="button"
            onClick={() => handleFileChange("restaurantImageFile", null)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
        {formData.restaurantImageFile && (
          <p className="mt-2 text-sm text-gray-600">{formData.restaurantImageFile.name}</p>
        )}
      </div>

      {/* Text Inputs */}
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <input
          id="restaurantName"
          type="text"
          value={formData.restaurantName}
          onChange={handleChange}
          placeholder="Sun valley restaurant"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="representativeName" className="block text-sm font-medium">Representative Name</label>
        <input
          id="representativeName"
          type="text"
          value={formData.representativeName}
          onChange={handleChange}
          placeholder="Darrell Steward"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="(+233) 01532548623"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* File Uploads */}
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

      {/* Date, Time, Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="established" className="block text-sm font-medium">Established</label>
          <input
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
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="G. P. O., Asafotase Nettey Road, Accra..."
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Update Restaurant
      </button>
    </form>
  );
};

export default EditRestaurantForm;
