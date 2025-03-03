const Giveaway = require('../models/Giveaway');
const { EmbedBuilder } = require('discord.js');

async function cancelGiveaway(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = await Giveaway.findOne({ messageId, ongoing: true });

  if (!giveaway) {
    return interaction.reply({
      content: 'Giveaway not found or has already ended.',
      ephemeral: true,
    });
  }

  giveaway.ongoing = false;
  await giveaway.save();

  const channel = await interaction.guild.channels.fetch(giveaway.channelId);
  const message = await channel.messages.fetch(giveaway.messageId);
  const embed = EmbedBuilder.from(message.embeds[0]);
  embed.setDescription(
    `Prize: **${giveaway.prize}**\nStatus: **Cancelled**\nHosted by: ${interaction.user}`
  );
  embed.setColor('#FF0000');

  await message.edit({ embeds: [embed], components: [] });
  await interaction.reply({
    content: 'Giveaway has been cancelled.',
    ephemeral: true,
  });
}

module.exports = cancelGiveaway;
