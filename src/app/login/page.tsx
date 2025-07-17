'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

// Zod schema for validation
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('https://bistroupulse-backend.onrender.com/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Login failed');

      const user = result.user;
      const token = result.token;
      const userRole = user?.role;

      if (!userRole || !token) throw new Error('Missing user role or token');

      // Save login info
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user?._id);

      toast.success('Login successful');
      reset();

      // Navigate based on role
      setTimeout(() => {
        switch (userRole.toLowerCase()) {
          case 'client':
            router.push('/customer/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'owner':
            router.push('/owner/dashboard');
            break;
          default:
            throw new Error('Unknown user role');
        }
      }, 1500);
    } catch (err) {
  let errorMessage = 'An unknown error occurred';

  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  }

  toast.error(`Login failed: ${errorMessage}`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <Image src="/icon.png" alt="BistroPulse Logo" width={68} height={68} className="mb-2" priority />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600">BistroPulse</h1>
            <p className="text-sm text-blue-500">Food at your doorstep</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 text-center">Sign in to your account</h2>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="example@gmail.com"
              className="pl-10 pr-3 py-2 border rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-blue-500" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-blue-500"
            />
            <label htmlFor="showPassword" className="text-gray-600">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white py-2 px-4 rounded w-full transition ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <p className="text-gray-600">New user?</p>
            <button onClick={() => router.push('/signup')} className="text-blue-500 hover:underline">
              Sign up
            </button>
          </div>
          <button onClick={() => router.push('/forgotPassword')} className="text-blue-500 hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
