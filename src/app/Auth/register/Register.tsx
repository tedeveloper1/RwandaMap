'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Zod validation schema (unchanged)
const registerSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmpassword: z.string(),
  phone: z.string().regex(/^[0-9]{9}$/, 'Invalid phone number (9 digits)').optional().or(z.literal('')),
  district: z.string().optional(),
  sector: z.string().optional()
}).refine((data) => data.password === data.confirmpassword, {
  message: "Passwords don't match",
  path: ["confirmpassword"]
});

type FormData = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema)
  });

  const redirectByRole = (role: string) => {
    const roleRoutes: Record<string, string> = {
      'admin': '/admin/dashboard',
      'technician': '/technician/dashboard',
      'default': '/dashboard'
    };
    router.push(roleRoutes[role] || roleRoutes.default);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        phone: data.phone ? `+250${data.phone}` : '',
        location: {
          district: data.district,
          sector: data.sector
        }
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, 
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // Essential for sessions
        }
      );

      if (response.data.success) {
        // Only store non-sensitive data in localStorage
        localStorage.setItem('userRole', response.data.user.role);
        
        toast.success('Registration successful! Redirecting...');
        redirectByRole(response.data.user.role);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Registration failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto lg:mx-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">
            <span className="block">Rwanda Map</span>
            <span className="block text-blue-200">Report Issue</span>
          </h1>
          <p className="text-blue-100 mb-8 text-lg">
            Welcome back! Sign in to continue making an impact in your community.
          </p>
          <ul className="space-y-4">
            {[
              { icon: "🔒", text: "Secure authentication" },
              { icon: "📱", text: "Access from any device" },
              { icon: "📈", text: "Track your reported issues" },
              { icon: "🔔", text: "Get status notifications" },
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-blue-100">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>


      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
              <button 
                onClick={() => router.push('/Auth')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Already have an account? <span className="font-semibold">Login</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    {...register('firstname')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.firstname ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstname.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    {...register('lastname')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.lastname ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                    +250
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="781234567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    id="district"
                    type="text"
                    {...register('district')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <input
                    id="sector"
                    type="text"
                    {...register('sector')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter sector"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmpassword"
                    type="password"
                    {...register('confirmpassword')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.confirmpassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmpassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmpassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;