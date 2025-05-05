import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, User, Filter, Clock, AlertCircle } from "lucide-react";

const RecentReport = ({
  containerVariants,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  isLoading,
  filteredReports,
  itemVariants,
  getReportIcon,
  getPriorityColor,
  getStatusColor,
  formatDate,
}) => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-emerald-500" />
            Recent Reports
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition-all"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 flex flex-col gap-4"
        >
          <AnimatePresence>
            {filteredReports.map((report) => (
              <motion.div
                key={report._id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white border border-gray-200 shadow hover:border-emerald-100 hover:bg-gray-50/50 transition-all rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                    {getReportIcon(report.category?.name || "Other")}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          {report.priority}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {report.location.district}, {report.location.sector}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>By {report.reportedBy?.name || "Anonymous"}</span>
                      </div>
                      {report.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Assigned to {report.assignedTo.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                      {report.resolvedAt && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Clock className="h-4 w-4" />
                          <span>Resolved {formatDate(report.resolvedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  );
};

export default RecentReport;
