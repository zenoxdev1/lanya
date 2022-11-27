const path = require("path");
const express = require("express");

const Lanya = require("./handlers/Lanya");
const { token } = require("./settings");

const client = new Lanya();
module.exports = client;
client.build(token);
const app = module.exports = express();


app.use("/static", express.static(path.join(__dirname, "public")));
app.use('/', require('./src/router/index'));

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
