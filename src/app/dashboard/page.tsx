"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, BarChart } from '@mui/x-charts';
import { FiAlertCircle, FiCheckCircle, FiClock, FiMapPin, FiUpload, FiBarChart2 } from 'react-icons/fi';

const CitizenDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('report');
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Pothole on KG 12 Ave",
      category: "Road",
      status: "Solved",
      date: "2023-05-15",
      location: "Kigali, Nyarugenge",
      image:
        "https://media.istockphoto.com/id/538686713/photo/cracked-asphalt-after-earthquake.jpg?s=612x612&w=0&k=20&c=SbzwfmL_xf0rgZ4spkJPZ6wD6tR4AzkYEeA5iyg-_u4=",
    },
    {
      id: 2,
      title: "Broken Street Light",
      category: "Electricity",
      status: "In Progress",
      date: "2023-06-02",
      location: "Kigali, Gasabo",
      image:
        "https://media.istockphoto.com/id/496026170/photo/broken-street-lamp.jpg?s=612x612&w=0&k=20&c=1bX4binyYkD8P_ZzHbfRTspKowTIGoTkSjxvbcjAkY4=",
    },
    {
      id: 3,
      title: "Clogged Drainage",
      category: "Sanitation",
      status: "Pending",
      date: "2023-06-10",
      location: "Kigali, Kicukiro",
      image:
        "https://media.istockphoto.com/id/965436718/photo/clogged-sink-pipe.jpg?s=612x612&w=0&k=20&c=c_Sd_yGwrioFdKCRb2dGovsFko7S9L6oH0vITtoZ9ME=",
    },
  ]);

  const [newIssue, setNewIssue] = useState({
    title: '',
    category: 'Road',
    description: '',
    location: '',
    image: null
  });

  // Stats data
  const statusData = [
    { label: 'Solved', value: 12, color: '#10B981' },
    { label: 'In Progress', value: 8, color: '#3B82F6' },
    { label: 'Pending', value: 5, color: '#F59E0B' }
  ];

  const categoryData = [
    { category: 'Road', count: 9 },
    { category: 'Electricity', count: 6 },
    { category: 'Water', count: 5 },
    { category: 'Sanitation', count: 4 },
    { category: 'Other', count: 2 }
  ];

  const handleSubmitIssue = (e) => {
    e.preventDefault();
    const submittedIssue = {
      id: issues.length + 1,
      title: newIssue.title,
      category: newIssue.category,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      location: newIssue.location,
      image: newIssue.image || '/default-issue.jpg'
    };
    setIssues([submittedIssue, ...issues]);
    setNewIssue({ title: '', category: 'Road', description: '', location: '', image: null });
    setActiveTab('my-issues');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewIssue({...newIssue, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Stats */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">RwandaSmartMap</h1>
              <p className="text-blue-100">Citizen Engagement Portal</p>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-white/40 text-gray-200 font-bold rounded-lg hover:bg-gray-100 flex items-center cursor-pointer hover:text-gray-800 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 border-2 cursor-pointer border-white p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-200">
              <div className="flex items-center">
                <FiAlertCircle className="text-yellow-300 text-2xl mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Total Reports</p>
                  <p className="text-xl font-bold">25</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 border-2 cursor-pointer border-white p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-200">
              <div className="flex items-center">
                <FiCheckCircle className="text-green-300 text-2xl mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Issues Solved</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 border-2 cursor-pointer border-white p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-200">
              <div className="flex items-center">
                <FiMapPin className="text-red-300 text-2xl mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Active Locations</p>
                  <p className="text-xl font-bold">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 mt-6">
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'report' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('report')}
          >
            <FiUpload className="mr-2" /> Report New Issue
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'my-issues' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('my-issues')}
          >
            <FiAlertCircle className="mr-2" /> My Reports
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'insights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insights')}
          >
            <FiBarChart2 className="mr-2" /> Community Insights
          </button>
        </div>

        {activeTab === 'report' ? (
          /* Report New Issue Form */
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiUpload className="mr-2 text-blue-500" /> Report a Public Issue
            </h2>
            <form onSubmit={handleSubmitIssue}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Issue Title*</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the issue"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Category*</label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                    >
                      <option value="Road">Road</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Location*</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="District, Sector, Cell"
                      value={newIssue.location}
                      onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Description*</label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Provide detailed information about the issue"
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Upload Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {newIssue.image ? (
                        <img src={newIssue.image} alt="Preview" className="max-h-40 mx-auto mb-2 rounded" />
                      ) : (
                        <div className="py-8">
                          <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
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
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md transition-all"
              >
                Submit Issue Report
              </button>
            </form>
          </div>
        ) : activeTab === 'my-issues' ? (
          /* My Reported Issues List */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiAlertCircle className="mr-2 text-blue-500" /> My Reported Issues
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm">All</button>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">Pending</button>
                  <button className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm">Solved</button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-full md:w-48 flex-shrink-0">
                        <img 
                          src={issue.image} 
                          alt={issue.title} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{issue.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiMapPin className="mr-1" /> {issue.location}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            issue.status === 'Solved' ? 'bg-green-100 text-green-800' :
                            issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">{issue.description || 'No additional description provided'}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <p className="text-sm text-gray-500">Reported on {issue.date}</p>
                          <button className="text-sm text-blue-600 hover:underline">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {issue.status !== 'Pending' && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Latest Update</h4>
                        <p className="text-sm text-gray-600">
                          {issue.status === 'Solved' 
                            ? 'This issue has been resolved by the authorities.'
                            : 'Officials are currently working on this issue.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Community Insights */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-blue-500" /> Issue Resolution Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-3">Issue Status Distribution</h3>
                  <div className="h-64">
                    <PieChart
                      series={[{
                        data: statusData,
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        
                      }]}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Issues by Category</h3>
                  <div className="h-64">
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: categoryData.map(item => item.category) }]}
                      series={[{ data: categoryData.map(item => item.count) }]}
                      colors={['#3B82F6']}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Community Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Most Reported Issue</h3>
                  <p className="text-blue-600 font-medium">Road Problems</p>
                  <p className="text-gray-500 text-sm">42 reports this month</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Fastest Resolution</h3>
                  <p className="text-green-600 font-medium">Electricity Issues</p>
                  <p className="text-gray-500 text-sm">Avg. 2.3 days to solve</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Active Citizens</h3>
                  <p className="text-purple-600 font-medium">1,248</p>
                  <p className="text-gray-500 text-sm">Reported issues this week</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Impact</h2>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Your reports have helped improve</p>
                  <p className="text-2xl font-bold text-blue-600">3 community areas</p>
                </div>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-blue-500 text-3xl" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-medium mb-2">RwandaSmartMap</h3>
              <p className="text-sm text-gray-600">Empowering citizens for better public services</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quick Links</h3>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="text-blue-600 hover:underline">How to Report</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">FAQ</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Community Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Support</h3>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="text-blue-600 hover:underline">Contact Us</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">support@rwandasmartmap.gov.rw</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} RwandaSmartMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenDashboard;