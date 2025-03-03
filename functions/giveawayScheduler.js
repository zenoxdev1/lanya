const { EmbedBuilder } = require('discord.js');
const Giveaway = require('../models/Giveaway');

async function checkGiveaways(client) {
  const now = new Date();

  const endedGiveaways = await Giveaway.find({
    ongoing: true,
    endTime: { $lte: now },
  });

  for (const giveaway of endedGiveaways) {
    const guild = await client.guilds.fetch(giveaway.guildId);
    const channel = await guild.channels.fetch(giveaway.channelId);
    const message = await channel.messages.fetch(giveaway.messageId);

    if (giveaway.participants.length < giveaway.winners) {
      const embed = EmbedBuilder.from(message.embeds[0]);
      embed.setDescription(
        `Prize: **${giveaway.prize}**\nStatus: **Cancelled - Not enough participants**`
      );
      embed.setColor('#FF0000');

      await message.edit({ embeds: [embed], components: [] });
      giveaway.ongoing = false;
      await giveaway.save();
      continue;
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

    const embed = EmbedBuilder.from(message.embeds[0]);
    embed.setTitle('Giveaway Ended');
    embed.setDescription(
      `Prize: **${giveaway.prize}**\nWinners: ${winners.map((w) => `<@${w}>`).join(', ')}`
    );
    embed.setColor('#00FF00');

    await message.edit({ embeds: [embed], components: [] });

    await channel.send(
      `🎉 Congratulations ${winners.map((w) => `<@${w}>`).join(', ')}! You won **${giveaway.prize}**! 🎉`
    );
  }
}

function startGiveawayScheduler(client) {
  setInterval(() => checkGiveaways(client), 10);
}

module.exports = startGiveawayScheduler;
