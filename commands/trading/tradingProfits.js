const { EmbedBuilder } = require("discord.js");
const { cryptoApiKey } = require("../../config.json");
const axios = require("axios");

const mongoose = require("mongoose");
const { mongo_uri } = require("../../config.json");
const User = require("../../database/user");

mongoose.connect(mongo_uri);

const fetchData = async (currency, symbolName) => {
  try {
    const response = await axios.post(
      "https://api.livecoinwatch.com/coins/single",
      {
        currency: `${currency}`,
        code: `${symbolName}`,
        meta: true,
      },
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": `${cryptoApiKey}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function convertToEpochTime(isoTimestamp) {
  const date = Math.floor(Date.parse(isoTimestamp) / 1000);
  return date;
}

const calculateProfit = (entryPrice, amountInvested, marketPrice) => {
  return Number(
    ((marketPrice - entryPrice) / entryPrice) * amountInvested
  ).toFixed(2);
};

module.exports = {
  name: "trade profit",
  aliases: ["tp"],
  description: "Triggers the trading update",
  usage: "",
  async execute(bot, message, args) {
    const currency = "USD";

    const intialReply = new EmbedBuilder()
      .setTitle("Calculating Profits...")
      .setColor("DarkGreen");
    message
      .reply({
        embeds: [intialReply],
      })
      .then(async (msg) => {
        let userData = await User.findOne({ userid: message.author.id });
        if (userData === null) {
          const user = await User.create({
            userid: message.author.id,
          });
        }
        userData = await User.findOne({ userid: message.author.id });
        const allTrades = userData.trades;

        let reply = new EmbedBuilder().setColor("DarkAqua");
        if (allTrades.length !== 0) {
          reply.setTitle(("Profits and Losses").toUpperCase());
          for (let i = 0; i < allTrades.length; i++) {
            const results = await fetchData(currency, allTrades[i].assetName);
            const trade = allTrades[i];
            const position = trade.position;
            reply.addFields({
              name: `\*\*${trade.assetName}/USD \*\*\t\*\*\*$${Number(
                results.rate
              ).toFixed(3)}\*\*\*\n\*\*Profit\t\t\*\*   : $${calculateProfit(
                position.avgprice,
                position.amount,
                Number(results.rate)
              )}`,
              value: "\n",
            });
          }
        } else {
          reply.setTitle("No Trades Available");
        }

        msg.edit({
          embeds: [reply],
        });
      });
  },
};
