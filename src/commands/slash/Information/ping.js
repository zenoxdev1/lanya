const { CommandInteraction, ApplicationCommandType } = require("discord.js");
const Lanya = require("../../../../handlers/Lanya");

module.exports = {
  // options
  name: "ping",
  description: `get ping of bot`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  type: ApplicationCommandType.ChatInput,
  cooldown: 10,
  // command start
  /**
   *
   * @param {Lanya} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
    client.embed(interaction, `Ping :: \`${client.ws.ping}\``);
  },
};
