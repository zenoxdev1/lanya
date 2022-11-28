const Discord = require("discord.js");
const express = require("express");
const Contact = express.Router();

Contact.get("/", function (req, res) {
  res.render("pages/contact");
});

module.exports = Contact;

// Contact endpoint
// app.get("/contact", async (req, res) => {
//   renderTemplate(res, req, "contact.ejs");
// });
// app.post("/contact", async (req, res) => {
//   if (req.body.type === "contact") {
//     const contactwebhook = new Discord.WebhookClient({
//       url: process.env.CONTACT_WEBHOOK,
//     });
//     if (!req.body.name || !req.body.id || !req.body.email || !req.body.msg)
//       return;
//     const contact = new Discord.MessageEmbed() // Prettier
//       .setColor("RANDOM")
//       .setTitle(`📬 Contact Form`)
//       .setDescription(`Someone just send message to us!`)
//       .addField(
//         `👥 User`,
//         `\`${req.body.name.substr(0, 100) || "Unknown"}\` | <@${
//           req.body.id
//         }> (ID: \`${req.body.id || "Unknown"}\`)`
//       )
//       .addField(
//         "📧 Email",
//         `\`\`\`${req.body.email.substr(0, 100) || "Unknown"}\`\`\``
//       )
//       .addField(
//         "📝 Message",
//         `\`\`\`${req.body.msg.substr(0, 2000) || "None"}\`\`\``
//       )
//       .setTimestamp()
//       .setFooter(
//         capitalize(client.user.username),
//         client.user.displayAvatarURL()
//       );
//     contactwebhook.send({
//       // Prettier
//       username: capitalize(client.user.username) + " Contact",
//       avatarURL: client.user.displayAvatarURL(),
//       embeds: [contact],
//     });
//   }
// });
