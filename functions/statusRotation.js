const { ActivityType } = require('discord.js');
const config = require('../config.json');

function updateStatus(client) {
  let currentIndex = 0;

  setInterval(() => {
    const status = config.statuses[currentIndex];

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
          type: ActivityType[status.type],
        },
      ],
      status: 'idle',
    });

    currentIndex = (currentIndex + 1) % config.statuses.length;
  }, 30000);
}

module.exports = updateStatus;
