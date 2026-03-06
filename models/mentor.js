// models/Mentor.js
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  // Mentor details
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Company details
  companyName: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Mentor", mentorSchema);
