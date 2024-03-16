const { EmbedBuilder } = require('discord.js');
const {cryptoApiKey} = require('../../config.json');
const axios = require('axios');
const {millify} = require('millify');

module.exports = {
  name : "quickPrice",
  description : "Shows live price (2 sec latency) of an asset",
  aliases : ['q','l',''],


  async execute(bot,message,args){
    
    const symbolName = args[0].toUpperCase();
    let currency = 'USD';
    if(args.length > 1){
    
    currency = args[1].toUpperCase();
    }


    const fetchData = async () => {
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

    const results = await fetchData();
   
    if(results === 0){
      const reply = new EmbedBuilder()
      // .setAuthor('Error #0', process.env.CROSSICON)
      
      .setTitle(`❌ Wrong Inputs`)
      .setDescription(`Either you have entered a symbol or currency which doesn\'t exist\n`)
      .addFields({name :'| For frequently used Currencies |',value:`\`\`\` ccf \`\`\``,inline:true})
      .addFields({name :'| To search particular currencies |',value:`\`\`\` ccf [Currency Name] \`\`\``,inline:true})
      .setColor('DarkRed')
      .addFields({name:"Search Currencies",value : `\`\`\` ccs [Asset Name or Symbol] \`\`\``})
 
      message.reply({ embeds: [reply] });
    }
    else{
    const reply = new EmbedBuilder()
      // .setAuthor('Error #0', process.env.CROSSICON)
      .setAuthor({name: `#${results.rank}   ${symbolName}/${currency}`,iconURL: `${results.png32}`})
      .setTitle(`Price : ${(Number(results.rate).toFixed(4))}`)
      .setColor(`${results.color}`)
      
      .setDescription(`Search Currencies :  \`\` ccs [Asset Name or Symbol] \`\``)
 
      message.reply({ embeds: [reply] });
    }
  }
}