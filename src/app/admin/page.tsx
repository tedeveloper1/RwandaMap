"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0
  });

  const [recentIssues, setRecentIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const issuesRes = await fetch('http://localhost:5000/api/issue/getissue');
      const categoriesRes = await fetch('http://localhost:5000/api/categories');

      const issues = await issuesRes.json();
      const categoriesData = await categoriesRes.json();

      const pendingIssues = issues.filter(issue => issue.status === 'pending').length;
      const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;

      setStats({
        totalUsers: 0,
        totalIssues: issues.length,
        pendingIssues,
        resolvedIssues
      });

      setRecentIssues(issues.slice(0, 5));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(prev => [...prev, data]);
        setNewCategory({ name: '', description: '' });
        setSubmitStatus({ success: true, message: 'Category added successfully!' });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: data.message || 'Failed to add category.' 
        });
      }
    } catch (error) {
      console.error('Server error:', error);
      setSubmitStatus({ 
        success: false, 
        message: 'Network error. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      className="p-8 min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(stats).map(([key, value]) => (
          <motion.div 
            key={key}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h2>
            <p className="text-2xl font-bold text-indigo-600 mt-2">
              {isLoading ? '...' : value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Add New Category Form */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Category</h2>
        <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
              {isLoading ? 'Submitting...' : 'Add Category'}
            </button>
          </div>
        </form>
        {submitStatus.message && (
          <p className={`mt-4 ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>{submitStatus.message}</p>
        )}
      </motion.div>

      {/* Recent Issues */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Issues</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">District</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map(issue => (
                <tr key={issue._id} className="border-t">
                  <td className="px-4 py-3">{issue.title}</td>
                  <td className="px-4 py-3">{issue.location?.district || 'Unknown'}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs ${issue.status === 'pending' ? 'bg-yellow-300' : issue.status === 'resolved' ? 'bg-green-300' : 'bg-blue-300'}`}>{issue.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Link to manage issues */}
      <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <Link href="/manage-issues" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Manage Issues</motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
