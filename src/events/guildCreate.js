const Event = require("../structures/Event.js");

class GuildCreate extends Event {
  async run(guild) {
    if (!guild.available) return;

    const channel = this.client.channels.cache.get("1060559005082198027");
    if (!channel) return;

    const owner = await this.client.users
      .fetch(guild.ownerId)
      .catch(() => null);

    const embed = this.client
      .embed()
      .setTitle("Lanya joined a new server!")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields({
        name: "Owner",
        value: owner?.tag ?? "No Owner Information",
        inline: true,
      })
      .addFields({
        name: "Member Count",
        value: guild.memberCount.toString(),
        inline: true,
      })
      .setFooter({ text: guild.id });

    return channel.send({ embeds: [embed] }).catch(() => null);
  }
}

module.exports = GuildCreate;
