// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // Student details
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  studentEmail: {
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

  // Mentor details
  companyName: {
    type: String,
    required: true
  },
  mentorName: {
    type: String,
    required: true
  },
  mentorEmail: {
    type: String,
    required: true
  },

  // Supervisor details
  supervisorName: {
    type: String,
    required: true
  },
  supervisorEmail: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);