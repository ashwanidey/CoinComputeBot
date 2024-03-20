const { createCanvas, Image,GlobalFonts  } = require("@napi-rs/canvas");
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

const calculateProfit = (entryPrice, amountInvested, marketPrice) => {
  return Number(
    ((marketPrice - entryPrice) / entryPrice) * amountInvested
  ).toFixed(2);
};

const changeTimeFormat = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedTime = date.toLocaleString("en-US", options);
  return formattedTime;
};

const canvaGenerator = (tradesDetails, currentPrice) => {
  const trades = tradesDetails[0].position;

  // console.log(changeTimeFormat(trades[0].createdat));
  const canvas = createCanvas(1700, 2 * 110);
  const context = canvas.getContext("2d", { colorSpace: "srgb" });

  context.fillStyle = "#333";
  context.fillRect(9, 0, canvas.width, canvas.height);
  // context.fillRect(0, 0, canvas.width, canvas.height);
  

  context.font = "43px Comic Neue";
  context.fillStyle = "#FFFFFF";

  const eachWidth = canvas.width / 5;
  const equalChange = 20;
  // context.fillText("Position", 0,0);
  context.fillText("Position", 50 + eachWidth * 0, canvas.height / 2 - 20);
  context.fillText(
    "Average Price",
    eachWidth * 1 - 40 - equalChange,
    canvas.height / 2 - 20
  );
  context.fillText(
    "Amount",
    eachWidth * 2 - 30 - equalChange,
    canvas.height / 2 - 20
  );
  context.fillText(
    "Profit",
    eachWidth * 3 - 110 - equalChange,
    canvas.height / 2 - 20
  );
  context.fillText(
    "Creation Date",
    eachWidth * 4 - 190 - equalChange,
    canvas.height / 2 - 20
  );

  for (let i = 0; i < 1; i++) {
    // console.log(canvas.height/(trades.length +1) * (i+1));
    context.fillText(
      `${trades.positionname.toUpperCase()}`,
      50 + eachWidth * 0,
      (canvas.height / 2) * (i + 2) - 60
    );
    context.fillText(
      `$ ${trades.avgprice}`,
      eachWidth * 1 - 40 - equalChange,
      (canvas.height / 2) * (i + 2) - 60
    );
    context.fillText(
      `$${Math.abs(trades.amount)}`,
      eachWidth * 2 - 30 - equalChange,
      (canvas.height / 2) * (i + 2) - 60
    );
    context.fillText(
      `${calculateProfit(
        trades.avgprice,
        trades.amount,
        Number(currentPrice.rate)
      )} USD`,
      eachWidth * 3 - 110 - equalChange,
      (canvas.height / 2) * (i + 2) - 60
    );
    context.fillText(
      `${changeTimeFormat(trades.createdat)}`,
      eachWidth * 4 - 190 - equalChange,
      (canvas.height / 2) * (i + 2) - 60
    );
  }

  const dataURI = canvas.toDataURL("image/png").split(",")[1];

  const attachment = {
    attachment: Buffer.from(dataURI, "base64"),
    name: "profile-image.png",
  };
  return attachment;
};

module.exports = canvaGenerator;
