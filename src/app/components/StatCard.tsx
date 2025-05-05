import React, { useState } from 'react'
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';

const StatCard = ({ containerVariants, reports, itemVariants }) => {
  const [active,setActive] = useState("")
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-4 gap-x-6"
    >
      {[
        {
          title: "Total Reports",
          value: reports.length,
          icon: <AlertCircle className={`h-6 w-6 text-green-600`} />,
          color: "green-600",
        },
        {
          title: "Pending",
          value: reports.filter((r) => r.status === "pending").length,
          icon: <Clock className={`h-6 w-6 text-orange-600`} />,
          color: "orange-600",
        },
        {
          title: "In Progress",
          value: reports.filter((r) => r.status === "in_progress").length,
          icon: <Upload className={`h-6 w-6 text-blue-600`} />,
          color: "blue-600",
        },
        {
          title: "Resolved",
          value: reports.filter((r) => r.status === "resolved").length,
          icon: <CheckCircle className={`h-6 w-6 text-green-600`} />,
          color: "green-600",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all`}
          onMouseEnter={() => setActive(stat.title)}
          onMouseLeave={() => setActive("")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium text-${stat.color}`}>
                {stat.title}
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  stat.title == active ? `text-${stat.color}` : `text-black`
                }`}
              >
                {stat.value}
              </p>
            </div>
            <div className="p-3 rounded-full bg-white/30">{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatCard