// Packages
require("dotenv").config();
const express = require("express");
const path = require("path");

// External Files
const LanyaClient = require("./structures/LanyaClient.js");

// Express Views
const app = (module.exports = express());
app.set("views", path.join(__dirname, "web/views"));
app.set("view engine", "ejs");

// Connect Discord
const client = new LanyaClient();
client.login();

// Express Routers
app.use("/", require("./web/router/home"));
app.use("/stats", require("./web/router/stats"));
app.use("/api", require("./web/api/v1"));

// Express Port
if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}
