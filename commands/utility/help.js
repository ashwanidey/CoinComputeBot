const { EmbedBuilder } = require("discord.js");

const axios = require("axios");

module.exports = {
  name: "help",
  description: "Shows live price (2 sec latency) of an asset",
  aliases: ["h", "commands"],

  async execute(bot, message, args) {
    const reply = new EmbedBuilder()
      .setTitle(`Coin Compute Bot Commands`.toUpperCase())
      .setDescription(
        `Below is the list of all the possible commands with there description!\n`
      )
      .addFields({
        name: `TRADE COMMANDS\n1️⃣  | cct | : Starts the trading setup \n2️⃣  | cctu |: Shows trade updates with details\n3️⃣  | cctp |: Shows profit of the trades`,
        value: "\n",
      })
      .addFields({
        name: `CRYPTO COMMANDS\n1️⃣  | ccs [symbolName] |: Searches the mentioned asset  \n2️⃣  | ccc [symbolName] <currency> | : Shows chart of asset.\n3️⃣  | ccp [symbolName] <currency>| : Shows detail about the crypto.\n`,
        value: "\n",
      })
      .addFields({
        name: `SUB COMMANDS\n1️⃣  | ccq [symbolName] |: Shows quick price of an asset  \n2️⃣  | ccf <currency> |: Shows available fiat.`,
        value: "\n",
      })
      .setColor("DarkVividPink");

    message.reply({ embeds: [reply] });
  },
};
