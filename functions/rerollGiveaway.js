const Giveaway = require('../models/Giveaway');

async function rerollGiveaway(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = await Giveaway.findOne({ messageId, ongoing: false });

  if (!giveaway) {
    return interaction.reply({
      content: 'Giveaway not found or is still ongoing.',
      ephemeral: true,
    });
  }

  if (giveaway.participants.length < giveaway.winners) {
    return interaction.reply({
      content: 'Not enough participants to reroll.',
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

  await interaction.reply(
    `🎉 New winners: ${winners.map((w) => `<@${w}>`).join(', ')}! Congratulations!`
  );
}

module.exports = rerollGiveaway;
