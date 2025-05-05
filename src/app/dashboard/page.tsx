"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  PhoneIcon,
  Phone,
  UserCircle2,
  UserCircle,
  Info,
  InfoIcon,
  Database,
} from "lucide-react";
import QuickAccess from "../components/QuickAccess";
import RecentReport from "../components/RecentReport";
import StatCard from "../components/StatCard";
import ReportForm from "../components/ReportForm";
import SideBar from "../sidebar/SideBar";
import Link from "next/link";
import PersonalProfile from "../components/PersonalProfile";
import { containerVariants, itemVariants, fadeIn } from "../utils/Nav";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: {
      district: "",
      sector: "",
      latitude: "",
      longitude: "",
    },
    image: null,
  });

  // Fetch reports from API
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/issue/getissue");
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, category: data[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCategories();
  }, []);

  // Filter reports based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter((report) => report.status === activeTab)
      );
    }
  }, [activeTab, reports]);

  // Search functionality
  useEffect(() => {
    const results = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.district
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredReports(results);
  }, [searchTerm, reports]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
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
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}`,
            { headers: { "User-Agent": "RwandaSmartMapApp/1.0" } }
          );
          const data = await response.json();
          return data && data.length > 0
            ? {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
              }
            : { latitude: 0, longitude: 0 };
        } catch (error) {
          console.error("Geocoding failed:", error);
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
          longitude,
        },
      };

      const response = await fetch("http://localhost:5000/api/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) throw new Error(await response.text());

      const savedIssue = await response.json();
      setShowReportForm(false);
      fetchReports(); // Refresh reports
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportIcon = (categoryName) => {
    switch (categoryName) {
      case "Road":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "Water":
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case "Electricity":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "Security":
        return <Shield className="w-5 h-5 text-purple-500" />;
      case "Health":
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 p-5">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-green-700 text-white shadow-md w-full rounded-full"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8" />
              <h1 className="text-2xl font-bold">RSmartMap</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hello">
                <h1 className="">
                  Welcome back , <span className="text-xl">Codejocker</span>
                </h1>
              </div>
              <Link href="/Auth/">
                <button className="bg-white/10 hover:bg-white/20 p-3  rounded-full flex items-center cursor-pointer transition-all duration-200">
                  <UserCircle2 className="h-5 w-5 font-bold" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Report Form Modal */}
      <ReportForm
        showReportForm={showReportForm}
        setShowReportForm={setShowReportForm}
        handleSubmitReport={handleSubmitReport}
        formData={formData}
        handleInputChange={handleInputChange}
        categories={categories}
        handleLocationChange={handleLocationChange}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-[300px] z-20 translate-y-9">
          <SideBar />
        </div>

        {/* Main Content Area */}
        <div className="flex w-full flex-auto">
          <div className="mx-auto px-8 py-8">
            <div className="grid gap-8">
              {/* Stats Cards Section */}
              <section className="stat-cards">
                <StatCard
                  containerVariants={containerVariants}
                  reports={reports}
                  itemVariants={itemVariants}
                />
              </section>

              {/* Main Content Grid */}
              <div className="grids grid-cols-1s xl:grid-cols-3s gap-8s">
                {/* Recent Reports Section - Takes up 2 columns */}
                <div className="xl:col-span-2 space-y-6">
                  <RecentReport
                    containerVariants={containerVariants}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isLoading={isLoading}
                    filteredReports={filteredReports}
                    itemVariants={itemVariants}
                    getReportIcon={getReportIcon}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                  />
                </div>

                {/* Quick Access Section - Takes up 1 column */}
                <div className="xl:col-span-1">
                  <div className="sticky top-8">
                    <QuickAccess
                      containerVariants={containerVariants}
                      itemVariants={itemVariants}
                      setShowReportForm={setShowReportForm}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* personal profile page */}
        <PersonalProfile />
      </div>
    </div>
  );
};

export default Dashboard;
