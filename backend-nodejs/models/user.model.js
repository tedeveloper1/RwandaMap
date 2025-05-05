const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  role:      { type: String, enum: ['user','technician','admin'], default: 'user' },
  password:  { type: String, required: true },
  phone:     { type: String, required: true },
  location: {
    latitude:  { type: Number },
    longitude: { type: Number },
    district:  { type: String },
    sector:    { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
