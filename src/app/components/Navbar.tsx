import { Mail, MapPin, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import { fadeIn } from "@/app/utils/Nav"
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAuthenticated , authToken , check_dashboard, authEmail , logout} = useAuth()
  const check_dash = check_dashboard(authToken)?.role;
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                RwandaSmartMap
              </span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <span className="border-b-2 border-green-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Home
                </span>
              </Link>
              <Link
                href={`${check_dash == "admin" ? "/admin" : "/dashboard"} `}
              >
                <span className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </span>
              </Link>
              <Link href="/about">
                <span className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  About
                </span>
              </Link>
              <Link href="/contact">
                <span className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Contact
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className='w-full flex gap-x-10'>
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 bg-gray-100 flex items-center">
                    <Mail className="h-5 w-5" />
                    <span className="ml-1 text-sm font-medium">
                      {authEmail}
                    </span>
                  </button>
                  <button className='px-5 cursor-pointer w-full rounded-full border border-red-600 text-red-600 hover:bg-red-700 hover:text-white transition-all duration-300' onClick={() => {logout()}}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/Auth">
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 bg-gray-100 flex items-center">
                    <User className="h-5 w-5" />
                    <span className="ml-1 text-sm font-medium">Login</span>
                  </button>
                </Link>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <span className="bg-green-50 text-green-700 block pl-3 pr-4 py-2 text-base font-medium">
                Home
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 text-base font-medium">
                Dashboard
              </span>
            </Link>
            <Link href="/about">
              <span className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 text-base font-medium">
                About
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 text-base font-medium">
                Contact
              </span>
            </Link>
            <div className="mt-4 pl-3 pr-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Report Issue
              </button>
            </div>
            <div className="mt-2 pl-3 pr-4">
              <Link href="/login">
                <button className="w-full border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  Login / Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar