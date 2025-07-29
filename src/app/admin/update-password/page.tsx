'use client';
import React, { useState } from 'react';
import { FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../../components/loadingSpinner'; // Assuming you have a loading spinner component
import PasswordStrengthIndicator from '../../../../components/passwordStrength'; // A new component for strength
 // For reading the auth token from cookies

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export default function UpdatePasswordPage() {
  // State to hold the values of the input fields
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '', // State for the confirmation field
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Validation for confirm_password ---
    // This check happens before we call the API.
    if (formData.new_password !== formData.confirm_password) {
      toast.error('New passwords do not match.');
      setLoading(false);
      return; // Stop the function if passwords don't match
    }

    const token = localStorage.getItem('token'); // Retrieve the auth token from cookies

    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }

    // This is the data that will be sent to the backend.
    // Notice `confirm_password` is not included.
    const body = {
        currentPassword: formData.current_password,
        newPassword: formData.new_password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Send the token for authentication
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update password.');
      }
      
      toast.success(result.message || 'Password updated successfully!');
      toast.success("Password updated successfully!");
      
      // Clear all form fields after successful submission
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-transparent">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-white">Update Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Input */}
          <div>
            <label className="block text-gray-700 dark:text-white">Current Password</label>
            <div className="relative">
              <FaKey className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword.current ? 'text' : 'password'}
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 border rounded-lg w-full"
                required
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute top-3 right-3 text-gray-500"
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-gray-700 dark:text-white">New Password</label>
            <div className="relative">
              <FaKey className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 border rounded-lg w-full"
                required
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute top-3 right-3 text-gray-500"
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <PasswordStrengthIndicator password={formData.new_password} />
          </div>

          {/* --- Confirm New Password Input --- */}
          {/* This input field is already here and fully functional. */}
          <div>
            <label className="block text-gray-700 dark:text-white">Confirm New Password</label>
            <div className="relative">
              <FaKey className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 border rounded-lg w-full"
                required
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute top-3 right-3 text-gray-500"
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}