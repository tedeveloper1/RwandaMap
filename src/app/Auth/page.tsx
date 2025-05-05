"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const email = localStorage.getItem("email")
    if (email) {
      router.push("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;

      if (token) {
        login(token); // Should handle token saving and navigation internally

        // Optional: store email in sessionStorage for later use
        sessionStorage.setItem("email", formData.email);
        localStorage.setItem("email", formData.email); // Store in localStorage as well
      } else {
        setError("Login failed: Token not provided");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto lg:mx-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">
            <span className="block">Rwanda Map</span>
            <span className="block text-blue-200">Report Issue</span>
          </h1>
          <p className="text-blue-100 mb-8 text-lg">
            Welcome back! Sign in to continue making an impact in your
            community.
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="john.doe@example.com"
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password *
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <Link
                    href="/Auth/register"
                    className="ml-auto text-sm text-blue-600 "
                  >
                    Create an account
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
