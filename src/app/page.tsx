'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  AlertCircle, 
  BarChart2, 
  Menu, 
  X, 
  User, 
  Clock, 
  AlertTriangle,
  Droplet,
  Zap,
  Shield,
  Heart,
  CheckCircle,
  UserPlus,
  Map as MapIcon,
  BellRing,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Navbar from './components/Navbar';
import { fadeIn, containerVariants, itemVariants } from './utils/Nav';
import { useAuth } from './context/AuthContext';

export default function Home() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Success stories for interactive section
  const successStories = [
    {
      id: 1,
      title: "Bridge Repair in Kigali",
      description: "After 57 reports from citizens, the damaged bridge in Kigali's business district was repaired within 72 hours",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
      stat: "72 hours response time"
    },
    {
      id: 2,
      title: "Water Supply Restored",
      description: "Community reporting led to quick identification of water supply issues affecting 3 neighborhoods",
      icon: <Droplet className="h-8 w-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
      stat: "5,000+ residents helped"
    },
    {
      id: 3,
      title: "Street Lighting Project",
      description: "Based on security reports, 120 new street lights were installed in previously dark areas",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      image: "https://images.unsplash.com/photo-1512058531953-9aca45847cc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
      stat: "32% crime reduction"
    }
  ];

  // Community engagement stats
  const communityStats = [
    { id: 1, title: 'Active Citizens', value: '8,750', icon: <UserPlus className="h-8 w-8 text-blue-500" /> },
    { id: 2, title: 'Districts Covered', value: '30', icon: <MapIcon className="h-8 w-8 text-green-500" /> },
    { id: 3, title: 'Avg Response Time', value: '24 hrs', icon: <Clock className="h-8 w-8 text-purple-500" /> },
    { id: 4, title: 'Issues Reported Today', value: '142', icon: <BellRing className="h-8 w-8 text-red-500" /> }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Mock API call for stats
    setStats({
      totalReports: 12500,
      resolutionRate: '87%',
      activeAgencies: 42,
      predictionAccuracy: '92%'
    });

    // Rotate through success stories
    const interval = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextStory = () => {
    setAnimationIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setAnimationIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>RwandaSmartMap - Citizen-Driven Infrastructure Management</title>
        <meta
          name="description"
          content="Report and track public infrastructure issues across Rwanda"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <Navbar
      />

      {/* Hero Section with Kigali Skyline Background */}
      <div className="relative h-screen min-h-[600px]">
        {/* Background Image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(5, 150, 105, 0.5), rgba(7, 89, 133, 0.5)), url('https://media.gettyimages.com/id/1132673374/photo/kigali-skyline-of-business-district-with-flag-rwanda.jpg?b=1&s=2048x2048&w=0&k=20&c=9nHRNohMnoyIUXK3kXhnjqDyC2U781Q0iGkjpRYYlHM=')",
          }}
        >
          {/* Gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-800/80"></div> */}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-2/3 lg:w-1/2"
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Together We Build</span>
                <span className="block text-green-200">A Smarter Rwanda</span>
              </h1>
              <p className="mt-3 text-xl text-green-100 sm:mt-5 sm:text-2xl">
                RwandaSmartMap empowers citizens to report infrastructure issues
                in real-time, leveraging AI to improve service delivery and
                national development.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-8"
                >
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Report Issue
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-700 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-8"
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  View Dashboard
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              AI-Powered Civic Technology
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
              Our platform leverages artificial intelligence to enhance public
              service delivery
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                title: "Real-Time Issue Detection",
                description:
                  "AI analyzes citizen reports to identify emerging issues",
                icon: <AlertCircle className="h-8 w-8 text-green-600" />,
                stat: stats?.totalReports?.toLocaleString() || "12,500",
              },
              {
                title: "Predictive Analytics",
                description:
                  "Anticipate infrastructure problems before they occur",
                icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
                stat: stats?.predictionAccuracy || "92%",
              },
              {
                title: "Automated Routing",
                description: "Reports automatically sent to relevant agencies",
                icon: <MapIcon className="h-8 w-8 text-purple-600" />,
                stat: stats?.activeAgencies || "42",
              },
              {
                title: "Resolution Tracking",
                description: "Monitor progress from report to resolution",
                icon: <CheckCircle className="h-8 w-8 text-green-600" />,
                stat: stats?.resolutionRate || "87%",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white shadow-sm mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-center text-gray-500">
                  {feature.description}
                </p>
                <div className="mt-4 text-3xl font-bold text-center text-green-600">
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive Success Stories & Community Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-gray-50 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-center text-gray-900 mb-8"
          >
            Community Impact
          </motion.h2>

          {/* Community Stats Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-xl font-bold text-center text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-center text-gray-500">
                  {stat.title}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Success Stories */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={animationIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-xl shadow-xl bg-white"
              >
                <div className="grid md:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={successStories[animationIndex].image}
                      alt="Success story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center mb-2">
                        {successStories[animationIndex].icon}
                        <span className="ml-2 text-white font-semibold">
                          {successStories[animationIndex].title}
                        </span>
                      </div>
                      <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full inline-block text-sm">
                        {successStories[animationIndex].stat}
                      </div>
                    </div>
                    <button
                      onClick={prevStory}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextStory}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content Side */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {successStories[animationIndex].title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {successStories[animationIndex].description}
                    </p>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                      <p className="text-green-700">
                        "This platform helped our community get faster responses
                        from local authorities."
                      </p>
                    </div>

                    {/* Progress Indicators */}
                    <div className="mt-8 flex space-x-2 justify-center">
                      {successStories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setAnimationIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === animationIndex
                              ? "bg-green-600 w-6"
                              : "bg-gray-300"
                          }`}
                          aria-label={`View success story ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              How RwandaSmartMap Works
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
              A simple process to report issues and contribute to Rwanda's
              development
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="mt-10">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Report an Issue",
                  description:
                    "Use our app or website to report infrastructure issues with photos and precise location data.",
                },
                {
                  step: "2",
                  title: "AI Processing",
                  description:
                    "Our system verifies, categorizes and prioritizes reports using artificial intelligence.",
                },
                {
                  step: "3",
                  title: "Resolution & Feedback",
                  description:
                    "Track resolution progress and receive notifications when issues are resolved.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="text-center bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                    <span className="font-bold">{feature.step}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Government Partnership Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-green-700 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <motion.div variants={itemVariants} className="lg:w-1/2">
              <h2 className="text-2xl font-extrabold sm:text-3xl mb-4">
                Official Government Partnership
              </h2>
              <p className="text-lg text-green-100 mb-6">
                RwandaSmartMap is officially recognized and supported by the
                Government of Rwanda as part of its Smart Rwanda initiative.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Rwanda.svg"
                    alt="Rwanda Flag"
                    className="h-12"
                  />
                </div>
                <div>
                  <p className="font-bold">Ministry of ICT and Innovation</p>
                  <p className="text-sm text-green-200">
                    Official Technology Partner
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-12"
            >
              <div className="bg-white bg-opacity-10 p-6 rounded-xl border border-green-600 border-opacity-30">
                <h3 className="text-xl font-bold mb-4">
                  Transparency Dashboard
                </h3>
                <p className="mb-4 text-green-100">
                  All reports and resolutions are publicly available through our
                  Open Data portal.
                </p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50">
                  Explore Public Data
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-white"
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to make a difference?</span>
              <span className="block text-green-600">
                Join our community today.
              </span>
            </h2>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 hover:shadow-lg"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 text-white"
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">RwandaSmartMap</h3>
              <p className="text-gray-400">
                AI-powered civic engagement platform for smarter communities.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/data" className="text-gray-400 hover:text-white">
                    Open Data
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-400 hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="mailto:info@rwandasmartmap.gov.rw"
                    className="text-gray-400 hover:text-white"
                  >
                    Email
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+250700123456"
                    className="text-gray-400 hover:text-white"
                  >
                    Phone
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RwandaSmartMap. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-400 hover:text-white text-sm"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}