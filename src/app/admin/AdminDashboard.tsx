"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const API_BASE = 'http://localhost:5000/api';

  // State management
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0
  });
  const [users, setUsers] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState({
    dashboard: false,
    users: false,
    category: false,
    roleUpdate: false
  });
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(prev => ({ ...prev, dashboard: true }));
    try {
      const [issuesRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/issue/getissue`),
        fetch(`${API_BASE}/categories`)
      ]);

      const issues = await issuesRes.json();
      const categoriesData = await categoriesRes.json();

      setStats(prev => ({
        ...prev,
        totalIssues: issues.length,
        pendingIssues: issues.filter(i => i.status === 'pending').length,
        resolvedIssues: issues.filter(i => i.status === 'resolved').length
      }));

      setRecentIssues(issues.slice(0, 5));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Dashboard error:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to load dashboard data'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  const fetchUsers = async () => {
    setIsLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_BASE}/users/getusers`, {
        method: 'GET',
        credentials: 'same-origin'  // Ensure session cookie is sent
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      const userArray = result.success ? result.data : [];
  
      console.log("Fetched users:", userArray);  // Debug log
  
      if (!userArray || userArray.length === 0) {
        console.warn("No users found in response data");
      }
  
      setUsers(userArray);
      setStats(prev => ({ ...prev, totalUsers: userArray.length }));
  
    } catch (error) {
      console.error('User fetch error:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to load users'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, users: false }));
    }
  };
  
  

// Handle role change
const handleRoleChange = async (userId, newRole) => {
  setIsLoading(prev => ({ ...prev, roleUpdate: true }));
  setSubmitStatus({ success: null, message: '' });

  try {
    console.log(`Attempting to update user ${userId} role to ${newRole}`); // Debug log

    const userRole = sessionStorage.getItem('role');
    
    const response = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userRole}` // Send role for role-based authentication if required
      },
      body: JSON.stringify({ role: newRole })
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update result:', result); // Debug log

    if (!result.success) {
      throw new Error(result.message || 'Role update failed');
    }

    // Update UI state
    setUsers(users.map(user => 
      user._id === userId ? { ...user, role: newRole } : user
    ));

    setSubmitStatus({
      success: true,
      message: result.message || 'Role updated successfully'
    });

  } catch (error) {
    console.error('Full error details:', error);
    setSubmitStatus({
      success: false,
      message: error.message || 'Failed to update role'
    });

    // Re-fetch users to ensure UI matches server state
    fetchUsers();
  } finally {
    setIsLoading(prev => ({ ...prev, roleUpdate: false }));
    setTimeout(() => setSubmitStatus({ success: null, message: '' }), 5000);
  }
};

  

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, category: true }));
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) throw new Error('Failed to add category');

      const data = await response.json();
      setCategories([...categories, data]);
      setNewCategory({ name: '', description: '' });
      setSubmitStatus({
        success: true,
        message: 'Category added successfully'
      });
    } catch (error) {
      console.error('Category error:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to add category'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, category: false }));
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 5000);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="p-8 min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
              {isLoading.dashboard ? '...' : value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-md mb-10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            User Management ({stats.totalUsers} users)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading.users ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstname || 'Unknown'} {user.lastname || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'technician' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <select
                               value={user.role}
                               onChange={(e) => handleRoleChange(user._id, e.target.value)}
                               disabled={isLoading.roleUpdate}
                               className="text-sm border rounded-md px-3 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                             >
                               <option value="user">User</option>
                               <option value="technician">Technician</option>
                               <option value="admin">Admin</option>
                                                   </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Category</h2>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading.category}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isLoading.category ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Issues</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">District</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map(issue => (
                  <tr key={issue._id} className="border-t border-gray-200">
                    <td className="px-4 py-3">{issue.title}</td>
                    <td className="px-4 py-3">{issue.location?.district || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {submitStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg ${
              submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;