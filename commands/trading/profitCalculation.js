// const {cryptoApiKey} = require('../../config.json')
// const axios = require('axios');

// const fetchData = async (currency,symbolName) => {
//   try {
//     const response = await axios.post('https://api.livecoinwatch.com/coins/single', {
//       currency: `${currency}`,
//       code: `${symbolName}`,
//       meta: true,
//     }, {
//       headers: {
//         'content-type': 'application/json',
//         'x-api-key': `${cryptoApiKey}`,
//       },
//     });

//     // Handle response data
//     return response.data
//   } catch (error) {
//     // Handle error
//     console.error('Error fetching data:', error);
//     // return 0;
//   }
// };


// const calculateProfit = async(entryPrice,amountInvested,currency,symbolName) => {

//   const currentPrice = await fetchData(currency,symbolName)
//   console.log(((currentPrice.rate - entryPrice)/entryPrice) * amountInvested);
// }

// calculateProfit(60000,200,'USD','BTC');