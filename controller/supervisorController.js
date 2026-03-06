
const express=require('express')

// GET: Student Login Page
const getsupervisorLogin = async (req, res) => {
  try {
    res.render("supervisor/login");
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).send("Server Error");
  }
};

const getSupervisorSignup = async (req, res) => {
  try {
    res.render("supervisor/signup");
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getsupervisorLogin,
  getSupervisorSignup,
};

