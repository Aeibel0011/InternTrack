const express = require("express");
const router = express.Router();

const student = require("../controller/studentController");
const { isAuthenticated } = require('../middleware/auth');

// Login page
router.get("/login", student.getStudentLogin);

// POST: Student Login
router.post("/login", student.postStudentLogin);

// Signup page
router.get("/signup", student.getStudentSignup);

//post signup
router.post("/signup", student.postStudentSignup);

// Home / Dashboard page (protected)
router.get("/home", isAuthenticated, student.getStudentHome);

// Logout
router.get('/logout', student.logoutStudent);


module.exports = router;
