const express=require('express')


// controllers/homeController.js

const getHomePage = (req, res) => {
  res.render("home");
};
const renderRoleSelect = (req, res) => {
  const mode = req.query.mode;

  if (!mode || !["login", "signup"].includes(mode)) {
    return res.redirect("/");
  }

  res.render("role-select", { mode });
};


module.exports = {
  getHomePage,
  renderRoleSelect,
};
