const Discord = require("discord.js");

const webhookClient = new Discord.WebhookClient({
  id: "1052874315659497524",
  token: "t7Uo2Oa5UA3-xl9nl1s3uT6A_T5FAmwAaQXUXcMIWm2v0f5Ui1FJXhX2rAiEvFAEv-AJ",
});

module.exports = async (client, interaction, args) => {
  const feedback = interaction.options.getString("feedback");

  const embed = new Discord.EmbedBuilder()
    .setTitle(`📝・New feedback!`)
    .addFields({
      name: "User",
      value: `${interaction.user} (${interaction.user.tag})`,
      inline: true,
    })
    .setDescription(`${feedback}`)
    .setColor(client.config.colors.normal);
  webhookClient.send({
    username: "Bot Feedback",
    embeds: [embed],
  });

  client.succNormal(
    {
      text: `Feedback successfully sent to the developers`,
      type: "editreply",
    },
    interaction
  );
};
