const Giveaway = require('../models/Giveaway');

async function listGiveaways(interaction) {
  const giveaways = await Giveaway.find({
    guildId: interaction.guild.id,
    ongoing: true,
  });

  if (!giveaways.length) {
    return interaction.reply({
      content: 'No ongoing giveaways in this server.',
      ephemeral: true,
    });
  }

  const giveawayList = giveaways
    .map(
      (g) =>
        `**Prize:** ${g.prize}\n**Ends In:** <t:${Math.floor(g.endTime.getTime() / 1000)}:R>\n**Message Id**: ${g.messageId}\n`
    )
    .join('\n');
  await interaction.reply({
    content: `Ongoing Giveaways:\n\n${giveawayList}`,
    ephemeral: true,
  });
}

module.exports = listGiveaways;
