const express = require("express");
const router = express.Router();

const supervisor = require("../controller/supervisorController");

// Login page
router.get("/login", supervisor.getsupervisorLogin);


// Signup page
router.get("/signup", supervisor.getSupervisorSignup);


module.exports = router;