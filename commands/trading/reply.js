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

const createSuccessReply = (
  targetPrice,
  amount,
  btcTradesUpdated,
  results,
  position
) => {
  let reply;
  if (btcTradesUpdated.length === 0) {
    reply = new EmbedBuilder()
      .setTitle("Trade successfully executed! ✅")

      .addFields({
        name: `Entry Price :${targetPrice}\nPosition : ${position}\nAmount : ${Math.abs(
          amount
        )}\nCreated At : <t:${convertToEpochTime(new Date())}>`,
        value: `\n`,
      });

    return reply;
  } else {
    const trades = btcTradesUpdated[0].position;
    const time = convertToEpochTime(trades.createdat);
    // console.log(trades);
    reply = new EmbedBuilder()
      .setTitle("Trade successfully executed! ✅")
      .addFields({
        name: `Entry Price  : $${targetPrice}\nPosition \t  : ${position}\nAmount\t   : $${Math.abs(
          amount
        )}\nCreated At : <t:${convertToEpochTime(new Date())}>`,
        value: `\n`,
      })

      .addFields({
        name: `\n\nUPDATED TRADE DETAILS\n\*\*Position \t\*\*  : ${trades.positionname.toUpperCase()}\n\*\*Avg Price \*\*   : $${
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

    return reply;
  }
};

module.exports = createSuccessReply;
