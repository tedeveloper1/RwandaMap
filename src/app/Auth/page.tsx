
// import React, { useState } from 'react';

// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     remember: false
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const redirectByRole = (role: string) => {
//     const routes: { [key: string]: string } = {
//       admin: '/admin',
//       technician: '/technician/dashboard',
//       default: '/dashboard'
//     };
//     router.push(routes[role] || routes.default);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post('/api/auth/login', {
//         email: formData.email,
//         password: formData.password,
//         remember: formData.remember
//       });

//       if (response.data.success) {
//         const storage = formData.remember ? localStorage : sessionStorage;
//         storage.setItem('userRole', response.data.user.role);
        
//         toast.success('Login successful!');
//         redirectByRole(response.data.user.role);
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 
//                          'Login failed. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
//       {/* Left Panel - Marketing Content (unchanged) */}
//       <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-12 flex flex-col justify-center">
//         <div className="max-w-md mx-auto lg:mx-0">
//           <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">
//             <span className="block">Rwanda Map</span>
//             <span className="block text-blue-200">Report Issue</span>
//           </h1>
//           <p className="text-blue-100 mb-8 text-lg">
//             Welcome back! Sign in to continue making an impact in your community.
//           </p>
//           <ul className="space-y-4">
//             {[
//               { icon: "🔒", text: "Secure authentication" },
//               { icon: "📱", text: "Access from any device" },
//               { icon: "📈", text: "Track your reported issues" },
//               { icon: "🔔", text: "Get status notifications" },
//             ].map((item, index) => (
//               <li key={index} className="flex items-start gap-3">
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="text-blue-100">{item.text}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Right Panel - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-8 sm:p-10">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Welcome Back
//               </h2>
//               <p className="text-gray-600">Sign in to access your dashboard</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Email Input */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Email Address *
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   placeholder="john.doe@example.com"
//                   autoComplete="username"
//                   required
//                 />
//               </div>

//               {/* Password Input */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Password *
//                   </label>
//                   <Link
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <input
//                   id="password"
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   autoComplete="current-password"
//                   required
//                 />
//               </div>

//               {/* Remember Me */}
//               <div className="flex items-center justify-between">
//                 <div className='flex items-center'>
//                   <input
//                     id="remember"
//                     type="checkbox"
//                     name="remember"
//                     checked={formData.remember}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor="remember"
//                     className="ml-2 block text-sm text-gray-700"
//                   >
//                     Remember me
//                   </label>
//                 </div>
//                 <div>
//                   <Link
//                     href="/Auth/register"
//                     className="ml-auto text-sm text-blue-600 hover:underline"
//                   >
//                     Create an account
//                   </Link>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                   isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : "Sign In"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

'use client'; // ✅ Tell Next.js this is a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Correct for app router

export default function Login() {
  const router = useRouter(); // ✅ make sure this line exists
  const [form, setForm] = useState({ email: '', password: '' });

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'same-origin', // Ensure session cookie is sent with request
    });

    const data = await res.json();

    if (res.ok) {
      // Store user data in sessionStorage
      sessionStorage.setItem('role', data.user.role); // Store role
      sessionStorage.setItem('userId', data.user.id);  // Store user ID

      router.push('/dashboard'); // Redirect to dashboard
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Function to verify user authentication on protected pages
export const verifyAuth = () => {
  const userRole = sessionStorage.getItem('role');

  if (!userRole) {
    alert('You are not logged in.');
    window.location.href = '/login'; // Redirect to login if no session data
  } else if (userRole !== 'admin') {
    alert('You are not authorized to view this page.');
    window.location.href = '/unauthorized'; // Redirect to unauthorized page if not admin
  }
};

// Function to handle logout
export const handleLogout = () => {
  // Clear sessionStorage when logging out
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('userId');

  window.location.href = '/login'; // Redirect to login page after logout
};
