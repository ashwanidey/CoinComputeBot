const { EmbedBuilder } = require('discord.js');
const {cryptoApiKey} = require('../../config.json');
const axios = require('axios');
const {millify} = require('millify');

module.exports = {
  name : 'price',
  aliases: ['p'],
  description: 'Shows data about the price of a particular coin',
  usage: '[Symbol] <Currency>',
  async execute(bot,message,args){
    symbolName = args[0].toUpperCase();
    console.log(symbolName);
   

   
    const fetchData = async () => {
      try {
        const response = await axios.post('https://api.livecoinwatch.com/coins/single', {
          currency: 'USD',
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
        console.error('Error fetching data:', error);
      }
    };
    
    const results = await fetchData();

    const reply = new EmbedBuilder()
      // .setAuthor('Error #0', process.env.CROSSICON)
      .setAuthor({name: `#${results.rank}   ${symbolName}/USD`,iconURL: `${results.png32}`})
      .setTitle(`Price : ${Number(results.rate).toFixed(4)}`)
      .setColor(`${results.color}`)
      .addFields({ name: 'Rate', value: `\`\`\`24H: ${results.delta.hour}\n7D : ${results.delta.week}\n\`\`\``, inline: true })
      .addFields({ name: '\nℹ️ Details', value: `\`\`\`All Time High      : ${Number(results.allTimeHighUSD).toFixed(4)}\nCirculating Supply : ${millify(results.circulatingSupply)}\nMax Supply         : ${millify(results.maxSupply)}\nVolume             : ${millify(results.volume)}\`\`\``, inline: true })
     
      .setTimestamp();
 
      message.reply({ embeds: [reply] });
  }
}