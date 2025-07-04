'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';

// Zod schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email address'),
});

// Infer the form data type
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Resetting password for:', data.email);
    // You can add API request logic here
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
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
}
