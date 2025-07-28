'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Assuming backend returns user info or token
      const result = await response.json()
      console.log('SignUp successful:', result)
if (result?.user?._id) {
      localStorage.setItem('userId', result.user._id)
      console.log('User ID stored:', result.user._id)
    }
      // Redirect or do something on success
      router.push('/verifyOtp') // for example
    } catch (err) {
        console.error(err);
      setError('Network error, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center gap-3 justify-center mb-4">
          <Image src="/icon.png" alt="BistroPulse Logo" width={68} height={68} />
          <div>
            <h1 className="text-4xl font-bold text-blue-600">BistroPulse</h1>
            <p className="text-sm text-gray-500">Food at your doorstep</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Create new account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div className="flex items-center gap-1 justify-center">
          <p className="text-gray-600">Already have account?</p>
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
