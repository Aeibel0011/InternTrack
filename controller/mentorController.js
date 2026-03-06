// controllers/mentorController.js

const bcrypt = require("bcrypt");
const Mentor = require("../models/mentor");
const Student = require("../models/student");

// ================= GET: Mentor Login Page =================
const getMentorLogin = async (req, res) => {
  try {
    res.render("mentor/login");
  } catch (error) {
    console.error("Mentor Login Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= POST: Mentor Login =================
const postMentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // ✅ LOGIN SUCCESS
    // Store the logged-in mentor's id in the session
    req.session.mentorId = mentor._id.toString();
    res.redirect("/mentor/home");

  } catch (error) {
    console.error("Mentor Login Error:", error);
    res.status(500).send("Login failed");
  }
};

// ================= GET: Mentor Signup Page =================
const getMentorSignup = async (req, res) => {
  try {
    res.render("mentor/signup");
  } catch (error) {
    console.error("Mentor Signup Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= POST: Mentor Signup =================
const postMentorSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      companyName,
    } = req.body;

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).send("Mentor already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save mentor
    const mentor = new Mentor({
      fullName,
      email,
      phone,
      password: hashedPassword,
      companyName,
    });

    await mentor.save();

    // Redirect to login after successful signup
    res.redirect("/mentor/login");

  } catch (error) {
    console.error("Mentor Signup Error:", error);
    res.status(500).send("Signup Failed");
  }
};

// ================= GET: Mentor Home / Dashboard =================
const getMentorHome = async (req, res) => {
  try {
    const mentorId = req.session && req.session.mentorId;
    if (!mentorId) {
      // Not logged in
      return res.redirect('/mentor/login');
    }

    const mentor = await Mentor.findById(mentorId).lean();
    if (!mentor) {
      // clear session if mentor no longer exists
      req.session.destroy(() => {});
      return res.redirect('/mentor/login');
    }

    // Fetch all students assigned to this mentor by email
    const assignedStudents = await Student.find({ mentorEmail: mentor.email }).lean();

    res.render('mentor/home', { mentor, assignedStudents });
  } catch (error) {
    console.error("Mentor Home Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= GET: Logout =================
const logoutMentor = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout Error:', err);
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

// ================= GET: Attendance Page =================
const getMentorAttendance = async (req, res) => {
  try {
    const mentorId = req.session && req.session.mentorId;
    if (!mentorId) {
      return res.redirect('/mentor/login');
    }

    const mentor = await Mentor.findById(mentorId).lean();
    if (!mentor) {
      req.session.destroy(() => {});
      return res.redirect('/mentor/login');
    }

    // Fetch all students assigned to this mentor by email
    const assignedStudents = await Student.find({ mentorEmail: mentor.email }).lean();

    res.render('mentor/attendance', { mentor, assignedStudents });
  } catch (error) {
    console.error("Mentor Attendance Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= GET: Students Listing Page =================
const getMentorStudents = async (req, res) => {
  try {
    const mentorId = req.session && req.session.mentorId;
    if (!mentorId) {
      return res.redirect('/mentor/login');
    }

    const mentor = await Mentor.findById(mentorId).lean();
    if (!mentor) {
      req.session.destroy(() => {});
      return res.redirect('/mentor/login');
    }

    // Fetch all students assigned to this mentor by email
    const assignedStudents = await Student.find({ mentorEmail: mentor.email }).lean();

    res.render('mentor/students', { mentor, assignedStudents });
  } catch (error) {
    console.error("Mentor Students Listing Error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getMentorLogin,
  postMentorLogin,
  getMentorSignup,
  postMentorSignup,
  getMentorHome,
  logoutMentor,
  getMentorAttendance,
  getMentorStudents,
};

