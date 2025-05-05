import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import React from 'react'

const ReportForm = ({
  showReportForm,
  setShowReportForm,
  handleSubmitReport,
  formData,
  handleInputChange,
  categories,
  handleLocationChange,
  isLoading,
}) => {
  return (
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Title*
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category*
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                          required
                        >
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority*
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["low", "medium", "high", "critical"].map((level) => (
                          <label
                            key={level}
                            className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                          >
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District*
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sector*
                      </label>
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
                    {isLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportForm