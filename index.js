const Lanya = require("./handlers/Lanya");
const { token } = require("./settings");

const client = new Lanya();

module.exports = client;

client.build(token);
