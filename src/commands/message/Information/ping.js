const { Message } = require("discord.js");
const Lanya = require("../../../../handlers/Lanya");

module.exports = {
  name: "ping",
  description: `get ping of bot`,
  userPermissions: [],
  botPermissions: [],
  category: "Information",
  cooldown: 10,
  /**
   *
   * @param {Lanya} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   */
  run: async (client, message, args, prefix) => {
    // Code
    client.embed(message, `Ping :: \`${client.ws.ping}\``);
  },
};
