const {
  AttachmentBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

function convertToEpochTime(isoTimestamp) {
  const date = Math.floor(Date.parse(isoTimestamp) / 1000);
  return date;
}

const calculateProfit = (entryPrice, amountInvested, marketPrice) => {
  return Number(
    ((marketPrice - entryPrice) / entryPrice) * amountInvested
  ).toFixed(2);
};

const generateOldTradeReply = (trades, time, results,asset,currency) => {
  const newReply = new EmbedBuilder()
    .setAuthor({
      name: `#${results.rank}   ${asset}/${currency}`,
      iconURL: `${results.png32}`,
    })
    .setTitle(`Price : ${Number(results.rate).toFixed(4)}`)
    .setColor(`${results.color}`)
    .addFields({
      name: `\*\*Position \t\*\*  : ${trades.positionname.toUpperCase()}\n\*\*Avg Price \*\*   : $${
        trades.avgprice
      }\n\*\*Amount \t\*\*  : $${Math.abs(
        trades.amount
      )}\n\*\*Profit\t\t\*\*   : $${calculateProfit(
        trades.avgprice,
        trades.amount,
        Number(results.rate)
      )}\n\*\*Created At\*\* : <t:${time}>`,
      value: "\n",
    });

    return newReply
};

module.exports = generateOldTradeReply;
