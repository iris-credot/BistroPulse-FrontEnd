'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams to get the token from the URL
import { useRouter } from 'next/navigation'

// Zod schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

// Infer the form data type
type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 const router = useRouter()
  const params = useParams();
  const token = params.token as string;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("No reset token found. Please use the link from your email.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/user/resetpassword/${token}`, {
        method: 'POST', // Or 'PATCH'/'PUT' depending on your API design
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: data.password,
          confirm: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred.');
      }

      setSuccess(result.message || 'Your password has been reset successfully!');
 router.push('/login')
    } catch (err) {
      setError('the err');
      console.error('Failed to reset password:', err);
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
            <p className="text-sm text-blue-500 -mt-1"> Create new password.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         
 {/* API Feedback Messages */}
          {success && <p className="text-green-600 text-center bg-green-100 p-2 rounded">{success}</p>}
          {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>}
        
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

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-blue-500" />
            <input
              type="password"
              placeholder="New Password"
              {...register('password')}
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-blue-500" />
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
             disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
