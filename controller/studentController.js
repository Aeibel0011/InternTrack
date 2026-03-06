// controllers/studentController.js

const bcrypt = require("bcrypt");
const Student = require("../models/student");

// ================= GET: Student Login Page =================
const getStudentLogin = async (req, res) => {
  try {
    res.render("student/login");
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).send("Server Error");
  }
};

// POST: Student Login
const postStudentLogin = async (req, res) => {
  try {
    const { studentEmail, password } = req.body;

    const student = await Student.findOne({ studentEmail });
    if (!student) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // ✅ LOGIN SUCCESS
    // Store the logged-in student's id in the session
    req.session.studentId = student._id.toString();
    res.redirect("/student/home");

  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).send("Login failed");
  }
};
// ================= GET: Student Signup Page =================
const getStudentSignup = async (req, res) => {
  try {
    res.render("student/signup");
  } catch (error) {
    console.error("Student Signup Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= POST: Student Signup =================
const postStudentSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      studentEmail,
      phone,
      password,
      companyName,
      mentorName,
      mentorEmail,
      supervisorName,
      supervisorEmail,
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ studentEmail });
    if (existingStudent) {
      return res.status(400).send("Student already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save student
    const student = new Student({
      firstName,
      lastName,
      studentEmail,
      phone,
      password: hashedPassword,
      companyName,
      mentorName,
      mentorEmail,
      supervisorName,
      supervisorEmail,
    });

    await student.save();

    // Redirect to login after successful signup
    res.redirect("/student/login");

  } catch (error) {
    console.error("Student Signup Error:", error);
    res.status(500).send("Signup Failed");
  }
};

// ================= GET: Student Home / Dashboard =================
const getStudentHome = async (req, res) => {
  try {
    const studentId = req.session && req.session.studentId;
    if (!studentId) {
      // Not logged in
      return res.redirect('/student/login');
    }

    const student = await Student.findById(studentId).lean();
    if (!student) {
      // clear session if student no longer exists
      req.session.destroy(() => {});
      return res.redirect('/student/login');
    }

    // Build simple objects expected by the view
    const studentData = {
      name: `${student.firstName} ${student.lastName}`,
      email: student.studentEmail,
      phone: student.phone,
    };

    const internship = {
      company: student.companyName || null,
      role: student.role || null,
      status: student.status || null,
      progress: student.progress || 0,
    };

    const mentor = {
      name: student.mentorName || null,
      email: student.mentorEmail || null,
      department: student.mentorDepartment || null,
    };

    res.render('student/home', { student: studentData, internship, mentor });
  } catch (error) {
    console.error("Student Home Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= GET: Logout =================
const logoutStudent = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout Error:', err);
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

module.exports = {
  getStudentLogin,
  getStudentSignup,
  postStudentSignup,
  postStudentLogin,
  getStudentHome,
  logoutStudent,
};
