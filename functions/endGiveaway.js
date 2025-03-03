const { EmbedBuilder } = require('discord.js');
const Giveaway = require('../models/Giveaway');

async function endGiveaway(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = await Giveaway.findOne({ messageId, ongoing: true });

  if (!giveaway) {
    return interaction.reply({
      content: 'Giveaway not found or has already ended.',
      ephemeral: true,
    });
  }

  if (giveaway.participants.length < giveaway.winners) {
    return interaction.reply({
      content: 'Not enough participants for the giveaway.',
      ephemeral: true,
    });
  }

  const winners = [];
  while (winners.length < giveaway.winners) {
    const winner =
      giveaway.participants[
        Math.floor(Math.random() * giveaway.participants.length)
      ];
    if (!winners.includes(winner)) {
      winners.push(winner);
    }
  }

  giveaway.ongoing = false;
  await giveaway.save();

  const channel = await interaction.guild.channels.fetch(giveaway.channelId);
  const message = await channel.messages.fetch(giveaway.messageId);
  let embed = message.embeds[0];

  if (!embed) {
    embed = new EmbedBuilder().setTitle('Giveaway Ended').setColor('#00FF00');
  } else {
    embed = EmbedBuilder.from(embed);
  }
  embed.setTitle('Giveaway Ended');
  embed.setDescription(
    `Prize: **${giveaway.prize}**\nWinners: ${winners.map((w) => `<@${w}>`).join(', ')}`
  );
  embed.setColor('#00FF00');

  await message.edit({ embeds: [embed], components: [] });
  await channel.send(
    `🎉 Congratulations ${winners.map((w) => `<@${w}>`).join(', ')}! You won **${giveaway.prize}**! 🎉`
  );
  await interaction.reply({
    content: 'Giveaway ended successfully and winners have been announced!',
    ephemeral: true,
  });
}

module.exports = endGiveaway;
