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
const generateExistingTradeReply = (results,asset,newTrade,oldTrade,btcTrades,currency) => {
  let reply;
  let row;
  if (btcTrades.length === 0) {
    row = new ActionRowBuilder().addComponents(newTrade);
    reply = new EmbedBuilder()
      .setAuthor({
        name: `#${
          results.rank
        }   ${asset}/${currency}`,
        iconURL: `${results.png32}`,
      })
      .setTitle(`Price : ${Number(results.rate).toFixed(4)}`)
      .addFields({ name: "No Existing Trades", value: "\n" })
      .setColor(`${results.color}`);

      return [reply,row];
  } else {
    row = new ActionRowBuilder().addComponents(oldTrade);
    // attachment = canvasGenerator(btcTrades, results);
    const trades = btcTrades[0].position;
    const time = convertToEpochTime(trades.createdat);

    reply = new EmbedBuilder()
      .setAuthor({
        name: `#${
          results.rank
        }   ${asset}/${currency}`,
        iconURL: `${results.png32}`,
      })

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
      })
      .setTitle(
        `Price : $${Number(results.rate).toFixed(
          4
        )}\n\nExisting Trades on the Pair`
      )
      .setColor(`${results.color}`);
    // .setImage("attachment://profile-image.png");
    return [reply,row];
  }
}

module.exports = generateExistingTradeReply;

