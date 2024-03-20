const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { cryptoApiKey } = require("../../config.json");
const axios = require("axios");
const { millify } = require("millify");
const image = "../../assets/ethMetamask.png";

module.exports = {
  name: "subscribe",
  aliases: ["sub", "b"],
  description: "Shows qr code inorder to subscribe",
  usage: "",
  async execute(bot, message, args) {
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("Transaction ID/Hash");

    // Add components to modal

    // Create the text input components
    const favoriteColorInput = new TextInputBuilder()
      .setCustomId("txnID")
      // The label is the prompt the user sees for this input
      .setLabel("Enter Your Transaction ID")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(
      favoriteColorInput
    );

    // Add inputs to the modal
    modal.addComponents(firstActionRow);
    // console.log(modal);

    const reply = new EmbedBuilder()
      // .setAuthor('Error #0', process.env.CROSSICON)

      .setTitle(`Address : 0x825deCAfc2fF5e84407F222CAe90F3897911e6D9`)
      .setImage(
        "https://cdn.discordapp.com/attachments/1217561386624876736/1219153708622024816/image.png?ex=660a445e&is=65f7cf5e&hm=b895bb43c347740204b1ad6d34fcc418761b2ec25032ee1412102b6e715953df&"
      )
      .setColor("Blurple")
      .setTimestamp();

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Transferred")
      .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Not Transferred")
      .setStyle(ButtonStyle.Danger);

    const reattempt = new ButtonBuilder()
      .setCustomId("reattempt")
      .setLabel("Reattempt")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

    message
      .reply({
        embeds: [reply],
        components: [row],
      })
      .then(async (msg) => {
        let transactionDetails = 0;
        let flag = 0;

        while (transactionDetails === 0) {
          const collectorFilter = (i) => i.user.id === message.author.id;
          try {
            const confirmation = await msg.awaitMessageComponent({
              filter: collectorFilter,
            });

            if (
              confirmation.customId === "confirm" ||
              confirmation.customId === "reattempt"
            ) {
              await confirmation.showModal(modal);

              const filter = (interaction) =>
                interaction.customId === "myModal";

              try {
                const submission = await confirmation.awaitModalSubmit({
                  filter,
                  time: 60_000,
                });

                let transactionId;

                if (submission.isModalSubmit()) {
                  transactionId = submission.fields.getTextInputValue("txnID");

                  await submission.update({
                    content: "Your submission was received successfully!",
                  });
                }
                const getTransactionDetails = async () => {
                  try {
                    const response = await axios.get(
                      `https://api.blockcypher.com/v1/eth/main/txs/${transactionId}`,
                      {
                        headers: {
                          "content-type": "application/json",
                        },
                      }
                    );
                    return response.data;
                  } catch (error) {
                    return 0;
                  }
                };

                transactionDetails = await getTransactionDetails();
                // console.log()
                if (transactionDetails === 0) {
                  const transactionReply = new EmbedBuilder()
                    .setTitle("Transaction Not Found")
                    .addFields({
                      name: "Transaction Hash or ID entered could be wrong or the transaction is not completed yet",
                      value:
                        "After completion of transaction reattempt the payment process",
                    });

                  const row = new ActionRowBuilder().addComponents(reattempt);

                  await msg.edit({
                    embeds: [transactionReply],
                    components: [row],
                  });
                  continue;
                } else {
                  function convertToEpochTime(isoTimestamp) {
                    const date = Math.floor(
                      Date.parse(isoTimestamp) / 1000 - 19800
                    );
                    return date;
                  }

                  // Assuming transactionDetails.recieved contains the ISO timestamp string
                  const epochTime = convertToEpochTime(
                    transactionDetails.received
                  );
                  // No need to convert epochTime to Number, as it's already a number
                  const transactionReply = new EmbedBuilder()
                    .setTitle("Transaction Details")
                    .addFields({
                      name: "Received From Address : ",
                      value: `0x${transactionDetails.addresses[0]}`,
                    })

                    .addFields({
                      name: "Received Date",
                      value: `<t:${epochTime}>`,
                    });

                  await msg.edit({
                    embeds: [transactionReply],
                    components: [],
                  });
                }
              } catch (e) {
                // await msg.edit({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
              }

              const address = "0x825deCAfc2fF5e84407F222CAe90F3897911e6D9";

              // if (confirmation.customId === 'myModal') {
              //   await interaction.reply({ content: 'Your submission was received successfully!' });
              // }
            } else if (confirmation.customId === "cancel") {
              await confirmation.update({
                content: "Action cancelled",
                components: [],
              });
            }
          } catch (e) {
            await msg.edit({
              content: "Confirmation not received within 1 minute, cancelling",
              components: [],
            });
          }
        }
      });
  },
};
