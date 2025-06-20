'use client'

import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation';
export default function LoginPage() {
    const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center gap-3 justify-center mb-4">
          <Image
            src="/icon.png"
            alt="BistroPulse Logo"
            width={68}
            height={68}
          />
          <div>
            <h1 className="text-4xl font-bold text-blue-600">BistroPulse</h1>
            <p className="text-sm text-gray-500">Food at your doorstep</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
          <div className="flex items-center gap-1">
            <p className="text-gray-600">  You already have an account?</p>
            <button 
              onClick={() => router.push('/login')} 
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </div>

             </div>
    </div>
  )
}