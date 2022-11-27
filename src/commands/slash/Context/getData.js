const {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
} = require("discord.js");
const Lanya = require("../../../../handlers/Lanya");

module.exports = {
  name: "messagedata",
  category: "Context",
  type: ApplicationCommandType.Message,
  /**
   *
   * @param {Lanya} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
    let msg = await interaction.channel.messages.fetch(interaction.targetId);
    interaction.editReply({
      content: msg.cleanContent || "No Message Found",
    });
  },
};
