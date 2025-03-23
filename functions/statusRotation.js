const { ActivityType } = require('discord.js');
require('dotenv').config();

function updateStatus(client) {
  let currentIndex = 0;

  const statuses = [
    {
      type: process.env.STATUS_TYPE || 'Playing',
      state: process.env.STATUS_STATE || 'with you.',
    },
  ];

  setInterval(() => {
    const status = statuses[currentIndex];

    let state = status.state
      .replace('{serverCount}', client.guilds.cache.size)
      .replace(
        '{userCount}',
        client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      );

    client.user.setPresence({
      activities: [
        {
          name: state,
          type: ActivityType[status.type.toUpperCase()] || ActivityType.Playing,
        },
      ],
      status: 'online',
    });

    currentIndex = (currentIndex + 1) % statuses.length;
  }, 30000);
}

module.exports = updateStatus;
