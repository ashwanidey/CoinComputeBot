const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  positionname: String,
  avgprice: Number,
  amount: Number,
  createdat: {
    type: Date,
    default: () => Date(),
  },
});

const tradeSchema = new mongoose.Schema({
  assetName: String,
  position: positionSchema,
});

const userSchema = new mongoose.Schema({
  userid: String,
  trades: [tradeSchema],
});



module.exports = mongoose.model("User", userSchema);
