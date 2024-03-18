// const axios = require('axios');
// const {cryptoApiKey} = require('./config.json');

const { default: axios } = require("axios");


// async function run(){
//   const fetchData = async () => {
//     try {
//       const response = await axios.post("https://api.livecoinwatch.com/fiats/all", {
       
//         meta: true,
//       }, {
//         headers: {
//           'content-type': 'application/json',
//           'x-api-key': `${cryptoApiKey}`,
//         },
//       });
  
//       // Handle response data
//       return response.data
//     } catch (error) {
//       // Handle error
//       console.error('Error fetching data:', error);
//     }
//   };

    
//   const livePriceApi = await fetchData();
//   console.log(livePriceApi);
//   }

// run();




// // console.log(results);



// const QuickChart = require('quickchart-js');

// const myChart = new QuickChart();
// myChart
//   .setConfig({
//     type: 'line',
//     data: {
//       labels: ['January', 'February', 'March', 'April', 'May'],
//       datasets: [
//         {
//           label: 'Dogs',
//           data: [50, 60, 70, 180, 190],
//           fill: false,
//           borderColor: 'blue',
//         },
//         {
//           label: 'Cats',
//           data: [100, 200, 300, 400, 500],
//           fill: false,
//           borderColor: 'green',
//         },
//       ],
//     },
//   })
//   .setWidth(300)
//   .setHeight(400)
//   .setBackgroundColor('transparent');

// // Print the chart URL
// console.log(myChart.getUrl());

// const date = new Date(1710652200*1000);
// const options = {
//   timeZone: 'Asia/Kolkata', // Set the time zone to IST
//   hour12: true, // Use 24-hour format
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
  
// };

// const ISTTime = date.toLocaleString('en-IN', options).split(',')[1].trim();

// console.log(ISTTime);

const transactionId = '0xcbb5fd12151e5b351797146c0c819deb142c05b03f52f133532d5377e09f8e51'
const address = '0x825deCAfc2fF5e84407F222CAe90F3897911e6D9';

function convertToEpochTime(isoTimestamp) {
  const date = new Date(isoTimestamp);
  return date.getTime(); // Returns epoch time in milliseconds
}

const call = async () => {
  const getTransactionDetails = async () => {
    try{
      const response = await axios.get(`https://api.blockcypher.com/v1/eth/main/txs/${transactionId}`,{
        headers: {
          'content-type': 'application/json',
        }
      })
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);

    }
    
  }

    const transactionDetails = await getTransactionDetails();
    console.log(typeof(convertToEpochTime(transactionDetails.received)));
    const time = 1673677163000
    console.log(time === convertToEpochTime(transactionDetails.received));
}

call();

