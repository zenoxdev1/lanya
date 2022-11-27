require('dotenv').config()
module.exports = {
  token: process.env.token,
  prefix: ".",
  embed: {
    color: "#2f3136",
    wrongcolor: "#2f3136",
    footertext: "",
    footericon: "",
  },
  emoji: {
    ERROR: "❌",
    SUCCESS: "✅",
    disabled: "🔴",
    enabled: "🟢",
    cleared: "🧹",
    time: "⏲️",
    search: "🔎",
    ping: "🏓",
    bot: "🤖",
  },
  // others
  guildID: "", // for slash command
};
