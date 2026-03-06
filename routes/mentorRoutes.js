const express = require("express");
const router = express.Router();

const mentor = require("../controller/mentorController");
const { isAuthenticated } = require('../middleware/auth');

// Login page
router.get("/login", mentor.getMentorLogin);

// POST: Mentor Login
router.post("/login", mentor.postMentorLogin);

// Signup page
router.get("/signup", mentor.getMentorSignup);

// POST: Mentor Signup
router.post("/signup", mentor.postMentorSignup);

// Home / Dashboard page (protected)
router.get("/home", isAuthenticated, mentor.getMentorHome);

// Attendance page (protected)
router.get("/attendance", isAuthenticated, mentor.getMentorAttendance);

// Students listing page (protected)
router.get("/students", isAuthenticated, mentor.getMentorStudents);

// Logout
router.get('/logout', mentor.logoutMentor);

module.exports = router;