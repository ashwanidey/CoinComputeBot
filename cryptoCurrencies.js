const {cryptoApiKey} = require('./config.json');
const  axios  = require("axios");

const fetchCoinDataLive = async (currency, symbolName) => {
  try {
    const response = await axios.post('https://api.livecoinwatch.com/coins/single', {
      currency: `${currency}`,
      code: `${symbolName}`,
      meta: true,
    }, {
      headers: {
        'content-type': 'application/json',
        'x-api-key': `${cryptoApiKey}`,
      },
    });

    // Handle response data
    return response.data
  } catch (error) {
    // Handle error
    // console.error('Error fetching data:', error);
    return 0;
  }
};

module.exports = fetchCoinDataLive;

