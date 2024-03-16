const { EmbedBuilder } = require('discord.js');
const { coinRankingApi,cryptoApiKey } = require("../../config.json");
const axios = require('axios');
const {millify} = require('millify');

module.exports = {
  name: 'search',
  aliases: ['s'],
  description: "Used to search crypto and choose the most relevant among them",
  async execute(bot, message, args) {
    const symbolName = args[0];

    const options = {
      method: 'GET',
      url: 'https://coinranking1.p.rapidapi.com/search-suggestions',
      params: {
        referenceCurrencyUuid: 'yhjMzLPhuIDl',
        query: `${symbolName}`
      },
      headers: {
        'X-RapidAPI-Key': `${coinRankingApi}`,
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
      }
    };

    const getData = async () => {
      try {
        const response = await axios.request(options);
        return response.data.data.coins;
      } catch (error) {
        console.error(error);
      }
    }

    const results = await getData();
    let reply;
    const numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    let searchResults = `${numEmojis[0]} ${results[0].name}\n`;

    for (let i = 1; i < results.length && i < 5; i++) {
      searchResults += `${numEmojis[i]} ${results[i].name}\n`;
    }

    if (results.length > 1) {

      const reply = new EmbedBuilder()
        .setTitle(`🔍 Search Results`)
        .setDescription(`\`\`\`${searchResults}\`\`\``)
        .setTimestamp();

      // Send the search results message and add reactions
       message.reply({ embeds: [reply] })
        .then(async msg => {
          for (let i = 0; i < results.length && i < 5; i++)
             msg.react(`${numEmojis[i]}`);

          // Create a reaction collector for the search results message
          const filter = (reaction, user) => {
            return numEmojis.includes(reaction.emoji.name) && user.id === message.author.id;
          };

          const collector = msg.createReactionCollector({ filter, time: 15000 });

          collector.on("collect", async(reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            const selectedIndex = numEmojis.indexOf(reaction.emoji.name);
            const selectedCoin = results[selectedIndex];

            

            const fetchData = async () => {
              try {
                const response = await axios.post('https://api.livecoinwatch.com/coins/single', {
                  currency: 'USD',
                  code: `${selectedCoin.symbol}`,
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
            // console.log(livePriceApi);
            
            const detailreply = new EmbedBuilder()
            .setAuthor({name: `${selectedCoin.name}/${selectedCoin.symbol}`, iconURL: `${livePriceApi.png32}`})
            .setTitle(`Price: ${Number(selectedCoin.price).toFixed(4)}`)
            .addFields({ name: '\nℹ️ Details', value: `\`\`\`All Time High      : ${Number(livePriceApi.allTimeHighUSD).toFixed(4)}\nCirculating Supply : ${millify(Number(results.circulatingSupply))}\nMax Supply         : ${millify(livePriceApi.maxSupply)}\nVolume             : ${millify(livePriceApi.volume)}\`\`\``, inline: true })
            
            .setTimestamp();

            message.reply({embeds : [detailreply]});



          });
        });
    } else {
      const reply = new EmbedBuilder()
        .setTitle(`🔍 Search Results`)
        .setColor(`Red`)
        .setDescription(`Nothing found`)
        .setTimestamp();

      await message.reply({ embeds: [reply] });
    }
  }
}
