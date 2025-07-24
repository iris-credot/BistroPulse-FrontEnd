'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBuilding, FaEnvelope, FaKey,  FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../../components/loadingSpinner';

// Corrected Type: Data from the API will not include a plain password.
interface OwnerData {
  _id: string;
  businessName: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

export default function CreateOwnerPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []); 


  const [step, setStep] = useState<'user' | 'owner' | 'success'>('user');
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
    businessName: '',
    retyped_password: ''
  });

  const [createdOwner, setCreatedOwner] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [newUserId, setNewUserId] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.user_email, password: formData.user_password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'User creation failed');

      setNewUserId(data.user._id);
      toast.success('User created successfully!');
      setStep('owner');
    } catch (error) {
     
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.user_password !== formData.retyped_password) {
      toast.error("Passwords do not match. Please re-type the password.");
      setLoading(false);
      return;
    }

    if (!newUserId) {
      toast.error('User ID is missing. Cannot create owner.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: newUserId,
          businessName: formData.businessName,
          plainTextPassword: formData.user_password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Backend Error:', data.message);
        throw new Error(data.message || 'Owner creation failed');
      }
      
      setCreatedOwner({
        ...data.owner,
        user: {
            _id: newUserId,
            email: formData.user_email,
            role: 'owner' 
        }
      });
      
      toast.success('Owner created and credentials sent!');
      setStep('success');
    } catch (error) {
    
     console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setFormData({ user_email: '', user_password: '', businessName: '' , retyped_password: ''});
    setNewUserId('');
    setStep('user');
    setCreatedOwner(null);
  };

  return (
    // Use min-h-screen for better scrolling on mobile, with responsive padding
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Added responsive padding to the main container */}
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 space-y-6">
        {step === 'user' && (
          <>
            <h2 className="text-xl font-bold text-indigo-700">Step 1: Enter the credentials</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                  <input
                    title='user-email'
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    className="pl-10 py-2 border rounded-lg w-full"
                    required
                    placeholder="Enter user email"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                  <FaKey className="absolute top-3 left-3 text-gray-400" />
                  <input
                    title='user-password'
                    type="password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    className="pl-10 py-2 border rounded-lg w-full"
                    required
                    placeholder="Enter user password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                // Full-width on mobile, auto-width on larger screens. Flex for spinner alignment.
                className="w-full sm:w-auto flex justify-center items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : 'Create User'}
              </button>
            </form>
          </>
        )}

        {step === 'owner' && (
          <>
            <h2 className="text-xl font-bold text-indigo-700">Step 2: Enter the business Name</h2>
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Business Name</label>
                <div className="relative">
                  <FaBuilding className="absolute top-3 left-3 text-gray-400" />
                  <input
                    title='business-name'
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="pl-10 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Retype the Password to Confirm</label>
                <div className="relative">
                  <FaKey className="absolute top-3 left-3 text-gray-400" />
                  <input
                    title='retype-password'
                    type="password"
                    name="retyped_password"
                    value={formData.retyped_password}
                    onChange={handleChange}
                    className="pl-10 py-2 border rounded-lg w-full"
                    required
                    placeholder="Retype the user password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                 // Full-width on mobile, auto-width on larger screens. Flex for spinner alignment.
                className="w-full sm:w-auto flex justify-center items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : 'Create'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && createdOwner && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheck className="text-green-600 text-4xl" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700">Owner Created!</h2>
            <p><strong>Business Name:</strong> {createdOwner.businessName}</p>
            <p><strong>Email:</strong> {createdOwner.user.email}</p>
            {/* Flex container stacks vertically on mobile, horizontally on larger screens */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              {/* Buttons are full-width on mobile */}
              <button onClick={reset} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Create Another
              </button>
              <button onClick={() => router.push('/admin/customer-list')} className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                View Owners
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}