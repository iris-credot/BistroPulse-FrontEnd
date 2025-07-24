'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Zod schema for code validation
const schema = z.object({
  code: z
    .string()
    .length(7, 'Code must be exactly 7 digits')
    .regex(/^\d{7}$/, 'Code must only contain numbers'),
});

type FormData = z.infer<typeof schema>;

export default function VerifyAccountForm() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/user/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: data.code }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Code Verified!');
        reset();
        // Navigate to another page if needed
        router.push('/create-client');
      } else {
        toast.error(result.message || 'Invalid verification code.');
      }
    } catch (error) {
      console.error('API error:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center justify-center">
          <Image src="/otp.png" alt="BistroPulse Logo" width={80} height={80} className="mb-2" />
          <label className="block text-center text-lg text-black font-bold">
            Enter Verification Code.
          </label>
          <p className="block text-center text-xs">We sent code to your email.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
          {/* Code Field */}
          <div className="relative mt-3">
            <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
            <input
              type="text"
              placeholder="Enter your 7-digit code"
              {...register('code')}
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={7}
            />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
