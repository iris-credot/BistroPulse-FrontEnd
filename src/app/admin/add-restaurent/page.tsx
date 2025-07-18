"use client";
import React from "react";
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { FileInputProps } from "../../../../types/FileInputProps";

const FileInput: React.FC<FileInputProps> = ({ label, id, onFileChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <Input
      id={id}
      type="file"
      onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-900 dark:text-gray-500 border border-gray-300 rounded-lg cursor-pointer dark:bg-gray-950 bg-gray-50 focus:outline-none"
    />
  </div>
);

const AddRestaurantForm: React.FC = () => {


  return (
    // Added responsive padding: p-4 on mobile, p-6 on larger screens
    <form className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md space-y-5 dark:bg-gray-800">
      <h2 className="text-xl font-semibold">Add Restaurant</h2>

     
      <div className="border border-dashed border-blue-400 p-4 rounded-md text-center">
        <p className="text-blue-500">+ Add Photo</p>
        {/* Buttons stack vertically on mobile and horizontally on larger screens */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
          <Button
            type="button"
            // Full-width on mobile, auto-width on larger screens
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:text-black"
          >
            + Restaurant Image
          </Button>
          <Button
            type="button"
            onClick={() => (null)}
            // Full-width on mobile, auto-width on larger screens
            className="w-full sm:w-auto text-red-500"
          >
            Remove
          </Button>
        </div>
      </div>

     
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <Input
          id="restaurantName"
          type="text"
          placeholder="Sun valley restaurant"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="representativeName" className="block text-sm font-medium">Representative Name</label>
        <Input
          id="representativeName"
          type="text"
          placeholder="Darrell Steward"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="(+233) 01532548623"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

     
      <FileInput
        id="businessLicense"
        label="Business License"
       
          onFileChange={() => (NaN)}
      />
      <FileInput
        id="ownerNID"
        label="Owner NID"
       onFileChange={() => (NaN)}
      />

   
      {/* This grid is already responsive: 1 column on mobile, 3 on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="established" className="block text-sm font-medium">Established</label>
          <Input
            id="established"
            type="date"
            className="w-full mt-1 p-2 border rounded  dark:text-gray-500"
          />
        </div>
        <div>
          <label htmlFor="workingPeriod" className="block text-sm font-medium">Working Period</label>
          <select
            id="workingPeriod"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-950 dark:text-gray-500"
          >
            <option value="">Select working period</option>
            <option>9:00 AM – 10:00 PM</option>
            <option>8:00 AM – 9:00 PM</option>
          </select>
        </div>
        <div>
          <label htmlFor="payment" className="block text-sm font-medium">Payment</label>
          <select
            id="payment"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-950 dark:text-gray-500"
          >
            <option value="">Select payment method</option>
            <option>Cash in hand</option>
            <option>Mobile Money</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <Input
          id="location"
          type="text"
          placeholder="G. P. O., Asafotase Nettey Road, Accra..."
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <Button
        type="submit"
        // Full-width on mobile, auto-width on larger screens
        className="w-full sm:w-auto bg-blue-600 text-white dark:text-black px-6 py-2 rounded hover:bg-blue-700"
      >
        Add Restaurant
      </Button>
    </form>
  );
};

export default AddRestaurantForm;