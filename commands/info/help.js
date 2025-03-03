const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(
      'Displays a list of commands or detailed info about a specific command.'
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Get detailed info about a specific command')
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().trim();
    const commandNames = [...interaction.client.commands.keys()];

    const filtered = commandNames
      .filter((name) => name.startsWith(focusedValue))
      .slice(0, 10)
      .map((name) => ({ name, value: name }));

    await interaction.respond(filtered);
  },

  async execute(interaction) {
    const { client } = interaction;
    const commandName = interaction.options.getString('command');
    const helpEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (commandName) {
      const command = client.commands.get(commandName);
      if (!command) {
        return interaction.reply({
          content: '❌ Command not found!',
          ephemeral: true,
        });
      }

      helpEmbed
        .setTitle(`🔍 Command: **/${command.data.name}**`)
        .setDescription(command.data.description || 'No description available.')
        .addFields(
          {
            name: '🛠️ Usage',
            value: `\`/${command.data.name}\``,
          },
          {
            name: 'ℹ️ Details',
            value: `${command.data.description}`,
          }
        );
      return interaction.reply({ embeds: [helpEmbed] });
    } else {
      const categories = {};
      client.commands.forEach((cmd) => {
        const category = cmd.category || 'Uncategorized';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(cmd.data.name);
      });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help-menu')
        .setPlaceholder('Choose a category')
        .addOptions(
          Object.keys(categories).map((category) => ({
            label: category,
            value: category,
            description: `Commands under ${category}`,
          }))
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      helpEmbed
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle('✨ Help Menu')
        .setDescription(
          'Browse available commands by selecting a category from the menu below. Use `/help <command>` for detailed info about a specific command.'
        )
        .addFields(
          Object.entries(categories).map(([category, commands]) => ({
            name: `${category}`,
            value: `${commands.length} commands available`,
            inline: true,
          }))
        );

      await interaction.reply({ embeds: [helpEmbed], components: [row] });

      const filter = (i) =>
        i.customId === 'help-menu' && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on('collect', async (i) => {
        const selectedCategory = i.values[0];
        const commandsInCategory = categories[selectedCategory];

        const categoryEmbed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle(`🔶 Commands: **${selectedCategory}**`)
          .setDescription(
            commandsInCategory
              .map((cmdName) => {
                const cmd = client.commands.get(cmdName);
                const cmdDescription =
                  cmd?.data?.description || 'No description available.';
                return `> \`/${cmdName}\` - ${cmdDescription}`;
              })
              .join('\n') || 'No commands available.'
          )
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        await i.update({ embeds: [categoryEmbed], components: [row] });
      });

      collector.on('end', async () => {
        const disabledMenu = selectMenu.setDisabled(true);
        const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
        await interaction.editReply({ components: [disabledRow] });
      });
    }
  },
};
