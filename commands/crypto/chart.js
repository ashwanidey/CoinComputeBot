const { EmbedBuilder } = require('discord.js');
const {cryptoApiKey,coinRankingApi} = require('../../config.json');
const axios = require('axios');
const {millify} = require('millify');
const QuickChart = require('quickchart-js');
const chart = require('chart.js')


module.exports = {
  name : 'chart',
  aliases: ['c','cx'],
  description: 'Shows Chart of a particular coin',
  usage: '[Symbol]',
  async execute(bot,message,args){

    symbolName = args[0].toUpperCase();
    console.log(symbolName);

    const searchOptions = {
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

    const getSearchedData = async () => {
      try {
        const response = await axios.request(searchOptions);
        return response.data.data.coins;
      } catch (error) {
        console.error(error);
      }
    }

    const searchedData = await getSearchedData();
   
    // console.log(searchedData[0].uuid);
   
    const options = {
      method: 'GET',
      url:  `https://coinranking1.p.rapidapi.com/coin/${searchedData[0].uuid}/history`,
      params: {
        referenceCurrencyUuid: 'yhjMzLPhuIDl',
        timePeriod: '24h'
      },
      headers: {
        'X-RapidAPI-Key': 'fef93e0117msh2c96991107f59b4p1fb309jsn5804230510a6',
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
      }
    };
    
    const getData = async()=>{
      try {
        const response = await axios.request(options);
        return response.data.data;
      } catch (error) {
        console.error(error);
      }
    }
    
    const data = await getData();
    const results = data.history;
    // console.log(results.map(s => s.price));

    const timeStamps = (timestamp) => {
      const date = new Date(timestamp*1000);
      const options = {
        timeZone: 'Asia/Kolkata', // Set the time zone to IST
        hour12: false, // Use 24-hour format
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        
      };

      const ISTTime = date.toLocaleString('en-IN', options).split(',')[1].trim();

      return ISTTime;
    }

    // console.log(results.slice(0,30).map(s => timeStamps(s.timestamp)).reverse());

    const myChart = new QuickChart();
myChart
  .setConfig({
    type: 'line',
    data: {
      labels: results.slice(0,35).map(s => timeStamps(s.timestamp)).reverse(),
      datasets: [
        {
          label: 'BTC PRICE',
          data: 
          // [61000, 62000, 68000, 64000, 65000, 66000, 67000,]
          
          results.slice(0,35).map(s => Number(s.price)).reverse()
         
          ,
          fill :false,
          
          borderColor: QuickChart.getGradientFillHelper('vertical', ['#eb3639', '#a336eb', '#36a2eb']),
          borderWidth: 5,
          "pointRadius": 0,
        
          
        },
      ]},
      options: {
        "title": {
      "display": true,
      "text": "Price Chart"
    },
    layout: {
      padding: {
        left : 30,
        right : 30,
        bottom : 20,
        top : 20,
      }
  },
        scales: {
          yAxes: [
        {
          ticks: {
            backdropPadding : 'red',
            fontSize: 13,
          },
        },
      ],
       xAxes: [
        {
          ticks: {
            
            fontSize: 13,
          },
        },
      ],
        },
        legend: {
      display: false
        },
      //   elements: {
      //     point: {
      //       pointStyle: "star",
      //   }
      // },
      
      
    },
  })
  .setWidth(800)
  .setHeight(400)
  .setBackgroundColor('white');

// Print the chart URL
// console.log(myChart.getUrl());
const emoji = data.change > 0 ? `📈` : `📉`;

const reply = new EmbedBuilder()
.setTitle(`${searchedData[0].symbol}/USD\nCurrent Price : $${Number(searchedData[0].price).toFixed(4)}\nChange : ${data.change}% ${emoji}` )
.setImage(myChart.getUrl());
message.reply({ embeds: [reply] });

    // const reply = new EmbedBuilder()
    //   // .setAuthor('Error #0', process.env.CROSSICON)
    //   .setAuthor({name: `#${results.rank}   ${symbolName}/USD`,iconURL: `${results.png32}`})
    //   .setTitle(`Price : ${Number(results.rate).toFixed(4)}`)
    //   .setColor(`${results.color}`)
    //   .addFields({ name: 'Rate', value: `\`\`\`24H: ${results.delta.hour}\n7D : ${results.delta.week}\n\`\`\``, inline: true })
    //   .addFields({ name: '\nℹ️ Details', value: `\`\`\`All Time High      : ${Number(results.allTimeHighUSD).toFixed(4)}\nCirculating Supply : ${millify(results.circulatingSupply)}\nMax Supply         : ${millify(results.maxSupply)}\nVolume             : ${millify(results.volume)}\`\`\``, inline: true })
     
    //   .setTimestamp();
 
    //   message.reply({ embeds: [reply] });
  }
}