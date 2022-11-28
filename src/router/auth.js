const express = require("express");
const Index = express.Router();

Index.get("/auth", function (req, res) {
  res.send("Hello");
});

module.exports = Index;
