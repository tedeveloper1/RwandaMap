const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Short title of the issue
  description: { type: String, required: true }, // Full details about the issue
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Linked to category
  
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved'], 
    default: 'pending' 
  },
  
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    district: { type: String },
    sector: { type: String }
  },
  
  dateCreated: { type: Date, default: Date.now },
  dateResolved: { type: Date },
  
  reportedBy: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or String
    default: 'Anonymous'
  },// The user who reported
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Technician assigned (optional)
  
  feedbackRating: { type: Number, min: 1, max: 5 } // (Optional) Rating after resolving
});

module.exports = mongoose.model('Issue', IssueSchema);
