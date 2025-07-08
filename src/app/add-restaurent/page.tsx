"use client";
import React from "react";

interface FileInputProps {
  label: string;
  id: string;
  onFileChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, onFileChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <input
      id={id}
      type="file"
      onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
    />
  </div>
);

const AddRestaurantForm: React.FC = () => {


  return (
    <form className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-5">
      <h2 className="text-xl font-semibold">Add Restaurant</h2>

     
      <div className="border border-dashed border-blue-400 p-4 rounded-md text-center">
        <p className="text-blue-500">+ Add Photo</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Restaurant Image
          </button>
          <button
            type="button"
            onClick={() => (null)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      </div>

     
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium">Restaurant Name</label>
        <input
          id="restaurantName"
          type="text"
          placeholder="Sun valley restaurant"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="representativeName" className="block text-sm font-medium">Representative Name</label>
        <input
          id="representativeName"
          type="text"
          placeholder="Darrell Steward"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <input
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

   
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="established" className="block text-sm font-medium">Established</label>
          <input
            id="established"
            type="date"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="workingPeriod" className="block text-sm font-medium">Working Period</label>
          <select
            id="workingPeriod"
            className="w-full mt-1 p-2 border rounded"
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
            className="w-full mt-1 p-2 border rounded"
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
        <input
          id="location"
          type="text"
          placeholder="G. P. O., Asafotase Nettey Road, Accra..."
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Add Restaurant
      </button>
    </form>
  );
};

export default AddRestaurantForm;
