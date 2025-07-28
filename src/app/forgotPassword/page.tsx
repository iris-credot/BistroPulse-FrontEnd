'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react'; 

// Zod schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email address'),
});

// Infer the form data type
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

 const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/user/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      // Handle successful response
      const result = await response.json();
      setSuccess('A password reset link has been sent to your email.');
      console.log('API Response:', result);

    } catch (err) {
      setError('the error');
      console.error('Failed to send reset link:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-row items-center justify-center mb-6 gap-2">
          <Image 
            src="/icon.png" 
            alt="BistroPulse Logo" 
            width={68}  
            height={68} 
            className="mb-2"
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-blue-600">BistroPulse</h1>
            <p className="text-sm text-blue-500 -mt-1">Food at your doorstep</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block text-center text-lg text-black font-bold">
            Reset your password.
          </label>
            {/* General Success/Error Messages */}
          {success && (
            <p className="text-green-600 text-center bg-green-100 p-2 rounded">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center bg-red-100 p-2 rounded">
              {error}
            </p>
          )}


          {/* Email Field */}
          <div className="relative mt-3">
            <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
             disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          >
           {isLoading ? 'Sending...' : 'Send Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
