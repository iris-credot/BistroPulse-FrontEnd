'use client';
import React, { useState } from 'react';
import { FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../../components/loadingSpinner'; // Assuming you have a loading spinner component
import PasswordStrengthIndicator from '../../../../components/passwordStrength'; // A new component for strength

export default function UpdatePasswordPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
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

    if (formData.new_password !== formData.confirm_password) {
      toast.error('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
       const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/user/password`, {
        method: 'POST',
       
        headers: {
            'Authorization': `Bearer ${token}`
          },
        
        body: JSON.stringify({
          currentPassword: formData.current_password,
          newPassword: formData.new_password,
        }),
      });

      if (!response.ok) {
        // Handle non-successful responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }
       toast.success('Password updated successfully!');

      const result = await response.json();
      console.log('Password updated successfully with data:', result);
      toast.success('Password updated successfully!');

      // Clear form data after successful submission
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

    } catch (error) {
      
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-transparent">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-center text-indigo-700 dark:text-white">Update Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full flex justify-center items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}