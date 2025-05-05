import React from 'react'
import { motion } from "framer-motion";
import { AlertCircle, BarChart2, Bell } from 'lucide-react';
const QuickAccess = ({
  containerVariants,
  itemVariants,
  setShowReportForm,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Report New Issue
        </h3>
        <p className="text-gray-600 mb-4">
          Submit a new infrastructure issue for government attention
        </p>
        <button
          onClick={() => setShowReportForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          Create Report
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Track Resolution
        </h3>
        <p className="text-gray-600 mb-4">
          Monitor the status of your submitted reports
        </p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          View My Reports
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Community Alerts
        </h3>
        <p className="text-gray-600 mb-4">
          Get notified about urgent issues in your area
        </p>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
          <Bell className="mr-2 h-5 w-5" />
          Set Up Alerts
        </button>
      </motion.div>
    </motion.div>
  );
};

export default QuickAccess