const {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
} = require("discord.js");
const Lanya = require("../../../../handlers/Lanya");

module.exports = {
  name: "avatar",
  category: "Context",
  type: ApplicationCommandType.User,
  /**
   *
   * @param {Lanya} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
    let user =
      interaction.guild.members.cache.get(interaction.targetId) ||
      client.users.cache.get(interaction.targetId);

    interaction.editReply({
      content: user.displayAvatarURL({ extension: "png", size: 2048 }),
    });
  },
};
