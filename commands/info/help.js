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
      'Displays a list of commands or details about a specific command.'
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Get details about a specific command')
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().trim().toLowerCase();
    const commandNames = [...interaction.client.commands.keys()];

    const filtered = commandNames
      .filter((name) => name.toLowerCase().startsWith(focusedValue))
      .slice(0, 10)
      .map((name) => ({ name, value: name }));

    await interaction.respond(
      filtered.length ? filtered : [{ name: 'No matches found', value: 'none' }]
    );
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
      return this.sendCommandHelp(interaction, client, commandName, helpEmbed);
    } else {
      return this.sendHelpMenu(interaction, client, helpEmbed);
    }
  },

  async sendCommandHelp(interaction, client, commandName, embed) {
    const command = client.commands.get(commandName);
    if (!command) {
      return interaction.reply({
        content:
          '❌ The command you entered was not found. Try using `/help` to see the available commands.',
        ephemeral: true,
      });
    }

    embed
      .setTitle(`📖 **Command Details: /${command.data.name}**`)
      .setDescription(command.data.description || 'No description available.')
      .addFields(
        { name: '🛠️ Usage', value: `\`/${command.data.name}\`` },
        { name: 'ℹ️ Details', value: command.data.description }
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },

  async sendHelpMenu(interaction, client, embed) {
    const categories = this.getCommandCategories(client);

    if (Object.keys(categories).length === 0) {
      return interaction.reply({
        content: '⚠️ No commands available.',
        ephemeral: true,
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Select a category')
      .addOptions(
        Object.keys(categories).map((category) => ({
          label: category,
          value: category,
          description: `Commands under ${category}`,
        }))
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    embed
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTitle('✨ Help Menu')
      .setDescription(
        'Use the menu below to explore commands by category. To get details on a specific command, type `/help <command>`.'
      )
      .addFields(
        Object.entries(categories).map(([category, commands]) => ({
          name: `${category}`,
          value: `${commands.length} commands available`,
          inline: true,
        }))
      );

    await interaction.reply({ embeds: [embed], components: [row] });
    this.createCollector(interaction, categories, row);
  },

  getCommandCategories(client) {
    const categories = {};
    client.commands.forEach((cmd) => {
      const category = cmd.category
        ? cmd.category.charAt(0).toUpperCase() +
          cmd.category.slice(1).toLowerCase()
        : 'Uncategorized';
      if (!categories[category]) categories[category] = [];
      categories[category].push(cmd.data.name);
    });
    return categories;
  },

  createCollector(interaction, categories, row) {
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
        .setTitle(`📂 **${selectedCategory} Commands**`)
        .setDescription(
          commandsInCategory
            .map((cmdName) => {
              const cmd = interaction.client.commands.get(cmdName);
              return `> \`/${cmdName}\` - ${cmd?.data?.description || 'No description available.'}`;
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
      const disabledMenu = new StringSelectMenuBuilder(
        row.components[0]
      ).setDisabled(true);
      const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
      await interaction.editReply({
        components: [disabledRow],
        content:
          '⌛ Help menu has timed out. Run `/help` again if you need more information.',
      });
    });
  },
};
