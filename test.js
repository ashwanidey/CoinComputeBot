const axios = require('axios');
const {cryptoApiKey} = require('./config.json');


async function run(){
  const fetchData = async () => {
    try {
      const response = await axios.post('https://api.livecoinwatch.com/coins/single', {
        currency: 'USD',
        code: `ETH`,
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
      console.error('Error fetching data:', error);
    }
  };

    
  const livePriceApi = await fetchData();
  console.log(livePriceApi);
  }

run();




// console.log(results);
