var express = require("express");

var home = express.Router();

home.get("/", function (req, res) {
  res.render("pages/home");
});

module.exports = home;
