'use client';

import {  ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
export default function AddNewAddress() {
  const { register,  formState: { errors } } = useForm();


  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/customer/addresses" className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Address</h1>
      </div>

      <form  className="space-y-4">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['Home', 'Work', 'Other'].map((type) => (
              <div key={type} className="flex items-center">
                <Input
                  type="radio"
                  id={type.toLowerCase()}
                  value={type}
                  {...register('addressType', { required: true })}
                  className="hidden peer"
                />
                <label
                  htmlFor={type.toLowerCase()}
                  className="w-full py-2 px-3 text-center text-sm border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
          {errors.addressType && <p className="mt-1 text-sm text-red-600">Please select an address type</p>}
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <Input
            type="text"
            id="contactName"
            {...register('contactName', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full name"
          />
          {errors.contactName && <p className="mt-1 text-sm text-red-600">This field is required</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            type="tel"
            id="phone"
            {...register('phone', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (___) ___-____"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">This field is required</p>}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1
          </label>
          <Input
            type="text"
            id="address1"
            {...register('address1', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Street address, P.O. box, company name"
          />
          {errors.address1 && <p className="mt-1 text-sm text-red-600">This field is required</p>}
        </div>

        {/* Address Line 2 (Optional) */}
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <Input
            type="text"
            id="address2"
            {...register('address2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <Input
            type="text"
            id="city"
            {...register('city', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="City"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">This field is required</p>}
        </div>

        {/* State & ZIP Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Province
            </label>
            <Input
              type="text"
              id="state"
              {...register('state', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="State"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP/Postal Code
            </label>
            <Input
              type="text"
              id="zip"
              {...register('zip', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="ZIP code"
            />
            {errors.zip && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </div>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            {...register('country', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && <p className="mt-1 text-sm text-red-600">Please select a country</p>}
        </div>

       

        {/* Save Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Check size={18} />
            Save Address
          </Button>
        </div>
      </form>
    </div>
  );
}