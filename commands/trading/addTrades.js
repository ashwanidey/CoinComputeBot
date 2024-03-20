const mongoose = require('mongoose');
const {mongo_uri} = require('../../config.json')
const User = require('../../database/user')

mongoose.connect(mongo_uri);

async function addTradesToUser(userId, trades) {
  try {
    let user = await User.findOne({ userid: userId }); // Check if user exists

    if (user) {
      // User exists, append new trades to existing trades array
      user.trades.push(...trades); // Assuming trades is an array of trade objects
    } else {
      // User does not exist, create a new user document
      user = new User({
        userid: userId,
        trades: trades// Assuming trades is an array of trade objects
      });
    }

    // Save the updated user document
    await user.save();
    console.log("Trades added successfully.");
  } catch (error) {
    console.error("Error adding trades:", error);
  }
}

// Example usage:

module.exports = addTradesToUser;