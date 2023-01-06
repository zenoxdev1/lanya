var express = require("express");

var stats = express.Router();

stats.get("/", function (req, res) {
  res.render('pages/stats');
});

module.exports = stats;
