const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { MemberData, GuildSettings } = require('../../models/Level');
const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server leaderboard based on levels and XP.'),
  async execute(interaction) {
    const guildData = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!guildData.levelingEnabled) {
      return interaction.reply({
        content: 'Leveling system is not enabled in this Server',
      });
    }
    const leaderboard = await MemberData.find({
      guildId: interaction.guild.id,
    })
      .sort({ level: -1, xp: -1 })
      .lean();

    if (leaderboard.length === 0) {
      return interaction.reply({
        content: 'No members found in the leaderboard.',
        ephemeral: true,
      });
    }

    const topMembers = leaderboard.slice(0, 10);

    registerFont('./utils/Poppins-Regular.ttf', { family: 'Poppins' });

    const canvasWidth = 934;
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1C1F26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    const innerStrokeColor = 'rgba(255, 255, 255, 0.3)';
    ctx.strokeStyle = innerStrokeColor;
    ctx.lineWidth = 15;
    ctx.strokeRect(7.5, 7.5, canvas.width - 15, canvas.height - 15);

    ctx.fillStyle = '#EAEAEA';
    ctx.font = 'bold 52px "Poppins"';
    ctx.fillText('🏆 Leaderboard', 40, 80);

    ctx.fillStyle = '#EAEAEA';
    ctx.font = 'bold 30px "Poppins"';
    ctx.fillText('Rank', 40, 120);
    ctx.fillText('User', 150, 120);
    ctx.fillText('Level', 500, 120);
    ctx.fillText('XP', 650, 120);

    ctx.strokeStyle = '#5E81AC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 130);
    ctx.lineTo(canvasWidth - 40, 130);
    ctx.stroke();

    for (let index = 0; index < topMembers.length; index++) {
      const member = topMembers[index];
      const user = interaction.guild.members.cache.get(member.userId);
      const userTag = user ? user.user.tag : 'Unknown User';

      ctx.fillStyle = '#EAEAEA';
      ctx.font = '24px "Poppins"';
      ctx.fillText(`#${index + 1}`, 40, 170 + index * 40);
      ctx.fillText(userTag, 150, 170 + index * 40);
      ctx.fillText(`${member.level}`, 500, 170 + index * 40);
      ctx.fillText(`${member.xp}`, 650, 170 + index * 40);

      ctx.strokeStyle = '#1C1F26';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 180 + index * 40);
      ctx.lineTo(canvasWidth - 40, 180 + index * 40);
      ctx.stroke();
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'leaderboard.png',
    });

    await interaction.reply({
      content: 'Here is the current leaderboard:',
      files: [attachment],
    });
  },
};
