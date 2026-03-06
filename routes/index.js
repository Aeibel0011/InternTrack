const express = require("express");
const router = express.Router();
const home = require("../controller/homeController");


// home router
router.get("/", home.getHomePage);


// selection page router

router.get("/role-select", home.renderRoleSelect);



module.exports = router;
