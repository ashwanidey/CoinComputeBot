const { EmbedBuilder } = require('discord.js');
const {cryptoApiKey} = require('../../config.json');
const axios = require('axios');
const {millify} = require('millify');

module.exports = {
  name : 'currency',
  aliases: ['fiat','f'],
  description: 'Shows the list of currencies available and there respective codes',
  usage: '[Currency] ',
  async execute(bot,message,args){
    let currency = '';
    if(args.length > 0)
    currency = args[0].toLowerCase();
    // console.log('in');

    
      const fetchData = async () => {
        try {
          const response = await axios.post("https://api.livecoinwatch.com/fiats/all", {
            meta: true,
          }, {
            headers: {
              'content-type': 'application/json',
              'x-api-key': `${cryptoApiKey}`,
            },
          });
      
          
          return response.data
        } catch (error) {
          // Handle error
          console.error('Error fetching data:', error);
        }
      };

    
    const results = await fetchData();

    const prominentCurrencies = ['USD','INR','EUR','JPY','GBP','AUD','CAD','CHF','CNH','HKD','NZD'];

    let searchedCurrency;

    if(currency === ''){
      searchedCurrency = results.filter(s => 
        prominentCurrencies.some(c => s.code.toLowerCase().includes(c.toLowerCase()))
      );
    }
    else{
     searchedCurrency = results.filter(s => currency.toLowerCase().includes(s.code.toLowerCase()) || s.name.toLowerCase().includes(currency.toLowerCase()));
    }
    


    let curr1 = 'No Currency Found';
    if(searchedCurrency.length !== 0){
    curr1 = `💰 ${searchedCurrency[0].name }: ${searchedCurrency[0].code}\n`;
    for(let i =1;i<searchedCurrency.length && i < 10;i++){
      curr1 += `💰 ${searchedCurrency[i].name }: ${searchedCurrency[i].code}\n`
    }
  }

    // console.log(curr1);
    const reply = new EmbedBuilder()
      // .setAuthor('Error #0', process.env.CROSSICON)
      
      .setTitle(`🪙 Currency List`)
      
      .setColor('DarkGreen')
      .setDescription(`\`\`\`${curr1}  \`\`\``)
     
      .setTimestamp();
 
      message.reply({ embeds: [reply] });
  }

}