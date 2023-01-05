require("dotenv").config();

const LanyaClient = require("./structures/LanyaClient.js");

const client = new LanyaClient();
client.login();
