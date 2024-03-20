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
const { cryptoApiKey } = require("../../config.json");
const axios = require("axios");
const { millify } = require("millify");
const mongoose = require("mongoose");
const { mongo_uri } = require("../../config.json");
const User = require("../../database/user");
const { createCanvas, Image } = require("@napi-rs/canvas");
const createSuccessReply = require("./reply");
const canvasGenerator = require("./canvasGenerator");
const generateExistingTradeReply = require("./existingTradeReply");
const generateOldTradeReply = require("./oldTradeReply");

const addTradesToUser = require("./addTrades");
const user = require("../../database/user");

mongoose.connect(mongo_uri);

function convertToEpochTime(isoTimestamp) {
  const date = Math.floor(Date.parse(isoTimestamp) / 1000);
  return date;
}

const calculateProfit = (entryPrice, amountInvested, marketPrice) => {
  return Number(
    ((marketPrice - entryPrice) / entryPrice) * amountInvested
  ).toFixed(2);
};

const currency = "USD";

const tradeModal = new ModalBuilder()
  .setCustomId("tradeModal")
  .setTitle("Trade Details");

const orderModal = new ModalBuilder()
  .setCustomId("orderModal")
  .setTitle("Select Trade");

const targetPrice = new TextInputBuilder()
  .setCustomId("targetPrice")
  .setLabel("Enter Target Price")
  .setStyle(TextInputStyle.Short);
const amount = new TextInputBuilder()
  .setCustomId("amount")
  .setLabel("Enter Amount in USD")
  .setStyle(TextInputStyle.Short);
const orderNumber = new TextInputBuilder()
  .setCustomId("orderNumber")
  .setLabel("Enter Order Number for interaction")
  .setStyle(TextInputStyle.Short);

const orderRow = new ActionRowBuilder().addComponents(orderNumber);
const seondActionRow = new ActionRowBuilder().addComponents(amount);

tradeModal.addComponents(seondActionRow);
orderModal.addComponents(orderRow);

const btc = new ButtonBuilder()
  .setCustomId("btc")
  .setLabel("BTC/USD")
  .setStyle(ButtonStyle.Secondary);
const eth = new ButtonBuilder()
  .setCustomId("eth")
  .setLabel("ETH/USD")
  .setStyle(ButtonStyle.Secondary);
const sol = new ButtonBuilder()
  .setCustomId("sol")
  .setLabel("SOL/USD")
  .setStyle(ButtonStyle.Secondary);
const bnb = new ButtonBuilder()
  .setCustomId("bnb")
  .setLabel("BNB/USD")
  .setStyle(ButtonStyle.Secondary);

const long = new ButtonBuilder()
  .setCustomId("long")
  .setLabel("LONG")
  .setStyle(ButtonStyle.Success);
const short = new ButtonBuilder()
  .setCustomId("short")
  .setLabel("SHORT")
  .setStyle(ButtonStyle.Danger);
const selected = new ButtonBuilder()
  .setCustomId("selected")
  .setLabel("✅")
  .setStyle(ButtonStyle.Success);
const close = new ButtonBuilder()
  .setCustomId("close")
  .setLabel("CLOSE")
  .setStyle(ButtonStyle.Secondary);

const newTrade = new ButtonBuilder()
  .setCustomId("newTrade")
  .setLabel("NEW TRADE")
  .setStyle(ButtonStyle.Secondary);

const oldTrade = new ButtonBuilder()
  .setCustomId("oldTrade")
  .setLabel("EXISTING TRADE")
  .setStyle(ButtonStyle.Secondary);

const assetList = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "ADA",
  "AVAX",
  "DOGE",
  "DOT",
];

let select = new StringSelectMenuBuilder()
  .setCustomId("coinMenu")
  .setPlaceholder("Select a Trading Pair")
  .addOptions();

for (let i = 0; i < assetList.length; i++) {
  select.addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel(`${assetList[i]}/USD`)
      .setDescription(`Trades ${assetList[i]}`)
      .setValue(`${assetList[i]}`)
  );
}

const menuRow = new ActionRowBuilder().addComponents(select);

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

module.exports = {
  name: "trade",
  aliases: ["t"],
  description: "Triggers the trading setup",
  usage: "",
  async execute(bot, message, args) {
    let asset;
    if (args.length !== 0) asset = args[0].toUpperCase();
    const intialReply = new EmbedBuilder()
      .setTitle("Setting Up")
      .setColor("DarkGreen");
    let cryptoSelection;
    let userData = await User.findOne({ userid: message.author.id });
    if (userData === null) {
      const user = await User.create({
        userid: message.author.id,
      });
    }
    // if (args.length !== 0) {

    //   message.reply({ embeds: [intialReply] }).then(async (msg) => {
    //     const collectorFilter = (i) => i.user.id === message.author.id;
    //     userData = await User.findOne({ userid: message.author.id });
    //     try{
    //     let results = await fetchData(currency, asset);
    //     const btcTrades =
    //       userData.trades.length === 0
    //         ? []
    //         : userData.trades.filter((trade) => trade.assetName === asset);
    //     const data = generateExistingTradeReply(
    //         results,
    //         asset,
    //         newTrade,
    //         oldTrade,
    //         btcTrades,
    //         currency
    //       ),
    //       row = data[1];
    //     reply = data[0];

    //     await msg.edit({
    //       embeds: [reply],
    //       components: [row],
    //       // files: [attachment],
    //     });
    //   }catch(e){
    //     console.log(e.message);
    //   }

    //   });

    // } else {
    message.reply({ embeds: [intialReply] }).then(async (m) => {
      // const row = new ActionRowBuilder().addComponents(btc, eth, sol, bnb);
      userData = await User.findOne({ userid: message.author.id });
      const allTrades = userData.trades;

      let reply = new EmbedBuilder()
        .setAuthor({ name: `Welcome ${message.author.tag}` })
        .setTitle("💹 Trading Setup")
        .addFields({
          name: "Choose a Trading Pair",
          value: "Select a pair from below to execute the trade",
        })
        .setColor("Blurple");

      if (allTrades.length !== 0) {
        reply.addFields({
          name: `All Existing Trades`,
          value: "\n",
        });
        for (let i = 0; i < allTrades.length; i++) {
          const results = await fetchData(currency, allTrades[i].assetName);
          const trade = allTrades[i];
          const position = trade.position;
          reply.addFields({
            name: `${
              trade.assetName
            }/USD\n\*\*Position \t\*\*  : ${position.positionname.toUpperCase()}\n\*\*Avg Price \*\*   : $${
              position.avgprice
            }\n\*\*Amount \t\*\*  : $${Math.abs(
              position.amount
            )}\n\*\*Profit\t\t\*\*   : $${calculateProfit(
              position.avgprice,
              position.amount,
              Number(results.rate)
            )}`,
            value: "\n",
          });
        }
      }

      m.edit({
        embeds: [reply],
        components: [menuRow],
      }).then(async (msg) => {
        const collectorFilter = (i) => i.user.id === message.author.id;

        const menuCollectorFilter = (interaction) => {
          return (
            interaction.isStringSelectMenu() &&
            interaction.customId === "coinMenu"
          );
        };

        try {
          cryptoSelection = await msg.awaitMessageComponent({
            filter: menuCollectorFilter,
          });

          let asset = cryptoSelection.values[0].trim().toUpperCase();

          const waitingReply = new EmbedBuilder().setTitle(
            "Wait for a few seconds"
          );
          await cryptoSelection.update({
            embeds: [waitingReply],
            components: [],
            files: [],
          });

          let results = await fetchData(currency, asset);

          userData = await User.findOne({ userid: message.author.id });

          const btcTrades =
            userData.trades.length === 0
              ? []
              : userData.trades.filter((trade) => trade.assetName === asset);
          let attachment;

          const data = generateExistingTradeReply(
              results,
              asset,
              newTrade,
              oldTrade,
              btcTrades,
              currency
            ),
            row = data[1];
          reply = data[0];

          await msg.edit({
            embeds: [reply],
            components: [row],
            // files: [attachment],
          });

          try {
            cryptoSelection = await msg.awaitMessageComponent({
              filter: collectorFilter,
            });

            if (cryptoSelection.customId === "oldTrade") {
              const waitingReply = new EmbedBuilder().setTitle(
                "Wait for a few seconds"
              );
              await cryptoSelection.update({
                embeds: [waitingReply],
                components: [],
                files: [],
              });

              results = await fetchData(currency, asset);
              const trades = btcTrades[0].position;
              const time = convertToEpochTime(trades.createdat);

              const newReply = generateOldTradeReply(
                trades,
                time,
                results,
                asset,
                currency
              );
              const row = new ActionRowBuilder().addComponents(
                long,
                short,
                close
              );

              await msg.edit({
                embeds: [newReply],
                components: [row],
                // files: [attachment],
              });

              let targetPrice = "a",
                amount = "a";

              while (isNaN(targetPrice) || isNaN(amount)) {
                cryptoSelection = await msg.awaitMessageComponent({
                  filter: collectorFilter,
                });
                // console.log(cryptoSelection.customId);
                if (cryptoSelection.customId === "long") {
                  await cryptoSelection.showModal(tradeModal);
                  const filter = (interaction) =>
                    interaction.customId === "tradeModal";
                  try {
                    const submission = await cryptoSelection.awaitModalSubmit({
                      filter,
                      time: 60_000,
                    });

                    if (submission.isModalSubmit()) {
                      targetPrice = Number(results.rate).toFixed(3);
                      // Number(submission.fields.getTextInputValue('targetPrice'));
                      amount = Number(
                        submission.fields.getTextInputValue("amount")
                      );

                      await submission.update({ content: "" });
                    }

                    if (isNaN(targetPrice) || isNaN(amount)) {
                      const errorReply = new EmbedBuilder()
                        .setTitle("Entered Data is Invalid")
                        .addFields({
                          name: "Only Numbers are allowed as input Data",
                          value: "Try again",
                        });
                      await msg.edit({ embeds: [errorReply] });
                      continue;
                    } else {
                      const trades = btcTrades[0].position;

                      const totalAmount = trades.amount + amount;

                      if (totalAmount === 0) {
                        await User.updateOne(
                          { userid: message.author.id },
                          {
                            $pull: {
                              trades: { assetName: asset },
                            },
                          }
                        );
                      } else {
                        const avgPrice = Number(
                          (trades.avgprice * trades.amount -
                            targetPrice * amount) /
                            (trades.amount - amount)
                        ).toFixed(3);

                        if (totalAmount > 0) position = "long";
                        else position = "short";

                        await User.updateOne(
                          {
                            userid: message.author.id,
                            "trades.assetName": asset,
                          },
                          {
                            $set: {
                              "trades.$.position.positionname": position,
                              "trades.$.position.avgprice": avgPrice,
                              "trades.$.position.amount": totalAmount,
                            },
                          }
                        );
                      }

                      const userDataUpdated = await User.findOne({
                        userid: message.author.id,
                      });
                      // console.log(userDataUpdated.trades);
                      const btcTradesUpdated =
                        userDataUpdated.trades.length === 0
                          ? []
                          : userDataUpdated.trades.filter(
                              (trade) => trade.assetName === asset.toUpperCase()
                            );

                      const successReply = createSuccessReply(
                        targetPrice,
                        amount,
                        btcTradesUpdated,
                        results,
                        "LONG"
                      );
                    }
                  } catch (e) {
                    const reply = new EmbedBuilder()
                      .setTitle("Setup Expired")
                      .addFields({
                        name: "You did not input any data",
                        value: "Try again",
                      })
                      .setColor("Red");
                    await msg.edit({
                      embeds: [reply],
                      components: [],
                      files: [],
                    });
                    console.log(e.message);
                  }
                } else if (cryptoSelection.customId === "short") {
                  await cryptoSelection.showModal(tradeModal);
                  const filter = (interaction) =>
                    interaction.customId === "tradeModal";
                  try {
                    const submission = await cryptoSelection.awaitModalSubmit({
                      filter,
                      time: 60_000,
                    });

                    if (submission.isModalSubmit()) {
                      targetPrice = Number(results.rate).toFixed(3);
                      // Number(submission.fields.getTextInputValue('targetPrice'));
                      amount = -Number(
                        submission.fields.getTextInputValue("amount")
                      );

                      await submission.update({ content: "" });
                    }

                    if (isNaN(targetPrice) || isNaN(amount)) {
                      const errorReply = new EmbedBuilder()
                        .setTitle("Entered Data is Invalid")
                        .addFields({
                          name: "Only Numbers are allowed as input Data",
                          value: "Try again",
                        });
                      await msg.edit({ embeds: [errorReply] });
                      continue;
                    } else {
                      let trades = btcTrades[0].position;
                      // console.log(targetPrice);

                      const totalAmount = trades.amount + amount;

                      if (totalAmount === 0) {
                        await User.updateOne(
                          { userid: message.author.id },
                          {
                            $pull: {
                              trades: { assetName: asset },
                            },
                          }
                        );
                      } else {
                        const avgPrice = Number(
                          (trades.avgprice * trades.amount -
                            targetPrice * amount) /
                            (trades.amount - amount)
                        ).toFixed(3);

                        let position;

                        if (totalAmount > 0) position = "long";
                        else position = "short";

                        await User.updateOne(
                          {
                            userid: message.author.id,
                            "trades.assetName": asset,
                          },
                          {
                            $set: {
                              "trades.$.position.positionname": position,
                              "trades.$.position.avgprice": avgPrice,
                              "trades.$.position.amount": totalAmount,
                            },
                          }
                        );
                      }

                      const userDataUpdated = await User.findOne({
                        userid: message.author.id,
                      });
                      const btcTradesUpdated =
                        userDataUpdated.trades.length === 0
                          ? []
                          : userDataUpdated.trades.filter(
                              (trade) => trade.assetName === asset.toUpperCase()
                            );

                      const successReply = createSuccessReply(
                        targetPrice,
                        amount,
                        btcTradesUpdated,
                        results,
                        "SHORT"
                      );
                      await msg.edit({
                        embeds: [successReply],
                        components: [],
                        files: [],
                      });
                    }
                  } catch (e) {
                    const reply = new EmbedBuilder()
                      .setTitle("Setup Expired")
                      .addFields({
                        name: "You did not input any data",
                        value: "Try again",
                      })
                      .setColor("Red");
                    await msg.edit({
                      embeds: [reply],
                      components: [],
                      files: [],
                    });
                    console.log(e.message);
                  }
                } else if (cryptoSelection.customId === "close") {
                  await User.updateOne(
                    { userid: message.author.id },
                    {
                      $pull: {
                        trades: { assetName: asset },
                      },
                    }
                  );
                  const waitingReply = new EmbedBuilder()
                    .setTitle("Closed Trade")
                    .setColor("DarkRed");
                  await cryptoSelection.update({
                    embeds: [waitingReply],
                    components: [],
                    files: [],
                  });
                }
              }
            } else if (cryptoSelection.customId === "newTrade") {
              const waitingReply = new EmbedBuilder().setTitle(
                "Wait for a few seconds"
              );
              await cryptoSelection.update({
                embeds: [waitingReply],
                components: [],
                files: [],
              });

              results = await fetchData(currency, asset);

              const newReply = new EmbedBuilder()
                .setAuthor({
                  name: `#${results.rank}   ${asset}/${currency}`,
                  iconURL: `${results.png32}`,
                })
                .setTitle(`Price : ${Number(results.rate).toFixed(4)}`)
                .setColor(`${results.color}`);

              const row = new ActionRowBuilder().addComponents(long, short);

              await msg.edit({
                embeds: [newReply],
                components: [row],
              });

              let targetPrice = "a",
                amount = "a";

              while (isNaN(targetPrice) || isNaN(amount)) {
                cryptoSelection = await msg.awaitMessageComponent({
                  filter: collectorFilter,
                });
                // console.log(cryptoSelection.customId);
                if (cryptoSelection.customId === "long") {
                  await cryptoSelection.showModal(tradeModal);
                  const filter = (interaction) =>
                    interaction.customId === "tradeModal";
                  try {
                    const submission = await cryptoSelection.awaitModalSubmit({
                      filter,
                      time: 60_000,
                    });

                    if (submission.isModalSubmit()) {
                      targetPrice = Number(results.rate).toFixed(3);
                      // Number(submission.fields.getTextInputValue('targetPrice'));
                      amount = Number(
                        submission.fields.getTextInputValue("amount")
                      );

                      await submission.update({ content: "" });
                    }

                    if (isNaN(targetPrice) || isNaN(amount)) {
                      const errorReply = new EmbedBuilder()
                        .setTitle("Entered Data is Invalid")
                        .addFields({
                          name: "Only Numbers are allowed as input Data",
                          value: "Try again",
                        });
                      await msg.edit({ embeds: [errorReply] });
                      continue;
                    } else {
                      // const trades = btcTrades[0].position;
                      // console.log(targetPrice);

                      const trade = {
                        assetName: asset,
                        position: {
                          positionname: "long",
                          avgprice: targetPrice,
                          amount: amount,
                        },
                      };

                      userData.trades.push(trade);
                      await userData.save();

                      const userDataUpdated = await User.findOne({
                        userid: message.author.id,
                      });
                      const btcTradesUpdated =
                        userDataUpdated.trades.length === 0
                          ? []
                          : userDataUpdated.trades.filter(
                              (trade) => trade.assetName === asset
                            );

                      const successReply = createSuccessReply(
                        targetPrice,
                        amount,
                        btcTradesUpdated,
                        results,
                        "LONG"
                      );
                      await msg.edit({
                        embeds: [successReply],
                        components: [],
                        files: [],
                      });
                    }
                  } catch (e) {
                    const reply = new EmbedBuilder()
                      .setTitle("Setup Expired")
                      .addFields({
                        name: "You did not input any data",
                        value: "Try again",
                      })
                      .setColor("Red");
                    await msg.edit({
                      embeds: [reply],
                      components: [],
                      files: [],
                    });
                    console.log(e.message);
                  }
                } else if (cryptoSelection.customId === "short") {
                  const position = cryptoSelection.customId;
                  await cryptoSelection.showModal(tradeModal);
                  const filter = (interaction) =>
                    interaction.customId === "tradeModal";
                  try {
                    const submission = await cryptoSelection.awaitModalSubmit({
                      filter,
                      time: 60_000,
                    });

                    if (submission.isModalSubmit()) {
                      targetPrice = Number(results.rate).toFixed(3);
                      amount = Number(
                        submission.fields.getTextInputValue("amount")
                      );
                      await submission.update({ content: "" });
                    }
                  } catch (e) {
                    const reply = new EmbedBuilder()
                      .setTitle("Setup Expired")
                      .addFields({
                        name: "You did not input any data",
                        value: "Try again",
                      })
                      .setColor("Red");
                    await msg.edit({
                      embeds: [reply],
                      components: [],
                      files: [],
                    });
                    console.log(e);
                  }
                }
              }
            }
          } catch (e) {
            console.log(e.message);
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
    // }
  },
};
