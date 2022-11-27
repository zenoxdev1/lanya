const Discord = require("discord.js");
const express = require("express");
const client = require("../../handlers/Lanya");
const Status = express.Router();

Status.get("/", function (req, res) {
  res.header("Content-Type", "application/json");
  res.render("pages/status");
});

module.exports = Status;
