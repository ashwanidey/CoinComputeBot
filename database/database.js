const mongoose = require("mongoose");
const { mongo_uri } = require("../config.json");
const User = require("./user");

mongoose.connect(mongo_uri);

// const connectDB = async () => {
//   try {
//       const conn = await
//       console.log(`Mongo db connected: ${conn.connection.host}`);
//   } catch (error) {
//       console.log(error);  
//       process.exit(1);
//   }
// };

async function run() {
  const user = await User.create({
    userid: "434770769185079296",
    trades: [
      {
        assetName: "BTC",
        position: 
          {
            positionname: "long",
            avgprice: 40000,
            amount: 200,
          },
        
      },
      {
        assetName: "SOL",
        position: 
          {
            positionname: "long",
            avgprice: 40000,
            amount: 200,
          },
        
      },
    ],
  });

  // console.log(user);

}

run();

// connectDB();
