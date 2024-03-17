// const axios = require('axios');
// const {cryptoApiKey} = require('./config.json');


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

const date = new Date(1710652200*1000);
const options = {
  timeZone: 'Asia/Kolkata', // Set the time zone to IST
  hour12: true, // Use 24-hour format
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  
};

const ISTTime = date.toLocaleString('en-IN', options).split(',')[1].trim();

console.log(ISTTime);