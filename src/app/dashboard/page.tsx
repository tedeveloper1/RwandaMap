"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle,
  BarChart2,
  CheckCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Droplet,
  Zap,
  Shield,
  Heart,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  User,
  Upload,
  Bell,
  X,
  Image,
  ChevronDown
} from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: {
      district: '',
      sector: '',
      latitude: '',
      longitude: ''
    },
    image: null
  });

  // Fetch reports from API
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/issue/getissue');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCategories();
  }, []);

  // Filter reports based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === activeTab));
    }
  }, [activeTab, reports]);

  // Search functionality
  useEffect(() => {
    const results = reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(results);
  }, [searchTerm, reports]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get coordinates from district/sector
      const getCoordinates = async () => {
        try {
          const query = `${formData.location.sector}, ${formData.location.district}, Rwanda`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            { headers: { 'User-Agent': 'RwandaSmartMapApp/1.0' } }
          );
          const data = await response.json();
          return data && data.length > 0 
            ? { 
                latitude: parseFloat(data[0].lat), 
                longitude: parseFloat(data[0].lon) 
              }
            : { latitude: 0, longitude: 0 };
        } catch (error) {
          console.error('Geocoding failed:', error);
          return { latitude: 0, longitude: 0 };
        }
      };

      const { latitude, longitude } = await getCoordinates();

      const reportPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: {
          district: formData.location.district,
          sector: formData.location.sector,
          latitude,
          longitude
        }
      };

      const response = await fetch('http://localhost:5000/api/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportPayload)
      });

      if (!response.ok) throw new Error(await response.text());

      const savedIssue = await response.json();
      setShowReportForm(false);
      fetchReports(); // Refresh reports
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportIcon = (categoryName) => {
    switch(categoryName) {
      case 'Road': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Water': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'Electricity': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Security': return <Shield className="w-5 w-5 text-purple-500" />;
      case 'Health': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-green-600 to-blue-800 text-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8" />
              <h1 className="text-2xl font-bold">RwandaSmartMap Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowReportForm(true)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md flex items-center"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Report Issue
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md flex items-center">
                <User className="mr-2 h-4 w-4" />
                My Account
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Report Form Modal */}
      <AnimatePresence>
        {showReportForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Report New Issue</h2>
                  <button 
                    onClick={() => setShowReportForm(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReport}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                            required
                          >
                            {categories.map(category => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority*</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['low', 'medium', 'high', 'critical'].map(level => (
                            <label key={level} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                              <input
                                type="radio"
                                name="priority"
                                value={level}
                                checked={formData.priority === level}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                required
                              />
                              <span className="capitalize">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                          {formData.image ? (
                            <div className="relative">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="max-h-40 mx-auto mb-2 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          ) : (
                            <div className="py-8">
                              <Image className="mx-auto text-gray-400 text-3xl mb-2" />
                              <p className="text-gray-500">Drag & drop or click to upload</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="issue-image"
                            onChange={handleImageUpload}
                          />
                          <label 
                            htmlFor="issue-image"
                            className="mt-2 inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.location.district}
                          onChange={handleLocationChange}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sector*</label>
                        <input
                          type="text"
                          name="sector"
                          value={formData.location.sector}
                          onChange={handleLocationChange}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'Total Reports', value: reports.length, icon: <AlertCircle className="h-6 w-6" />, color: 'bg-blue-100 text-blue-800' },
            { title: 'Pending', value: reports.filter(r => r.status === 'pending').length, icon: <Clock className="h-6 w-6" />, color: 'bg-yellow-100 text-yellow-800' },
            { title: 'In Progress', value: reports.filter(r => r.status === 'in_progress').length, icon: <Upload className="h-6 w-6" />, color: 'bg-blue-100 text-blue-800' },
            { title: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, icon: <CheckCircle className="h-6 w-6" />, color: 'bg-green-100 text-green-800' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`${stat.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-white/30">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Reports Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-200"
            >
              <AnimatePresence>
                {filteredReports.map((report) => (
                  <motion.div
                    key={report._id}
                    variants={itemVariants}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getReportIcon(report.category?.name || 'Other')}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-gray-600">{report.description}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span>{report.location.district}, {report.location.sector}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4" />
                              <span>Reported by {report.reportedBy?.name || 'Anonymous'}</span>
                            </div>
                            {report.assignedTo && (
                              <div className="flex items-center">
                                <User className="mr-1 h-4 w-4" />
                                <span>Assigned to {report.assignedTo.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span>Reported on {formatDate(report.createdAt)}</span>
                            {report.resolvedAt && (
                              <span className="ml-4">Resolved on {formatDate(report.resolvedAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>

        {/* Quick Actions */}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report New Issue</h3>
            <p className="text-gray-600 mb-4">Submit a new infrastructure issue for government attention</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Track Resolution</h3>
            <p className="text-gray-600 mb-4">Monitor the status of your submitted reports</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Community Alerts</h3>
            <p className="text-gray-600 mb-4">Get notified about urgent issues in your area</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
              <Bell className="mr-2 h-5 w-5" />
              Set Up Alerts
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;