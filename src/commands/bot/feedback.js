const Discord = require('discord.js');

const webhookClient = new Discord.WebhookClient({
    id: '1068068410510032986',
    token: 'qjBizK03CBC63HcN-k4LDn0-s9OjOpugsC9zzfG2-FU0HSDytrDn4BFZ4KeiHMY6XsWm',
});

module.exports = async (client, interaction, args) => {
    const feedback = interaction.options.getString('feedback');

    const embed = new Discord.EmbedBuilder()
        .setTitle(`📝・New feedback!`)
        .addFields({ name: 'User', value: `${interaction.user} (${interaction.user.tag})`, inline: true })
        .setDescription(`${feedback}`)
        .setColor(client.config.colors.normal);
    webhookClient.send({
        username: 'Bot Feedback',
        embeds: [embed],
    });

    client.succNormal(
        {
            text: `Feedback successfully sent to the developers`,
            type: 'editreply',
        },
        interaction
    );
};
