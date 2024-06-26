const fs = require('node:fs');
const path = require('node:path');
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.listen(3001, () => console.log(`Server Port: ${3001}`));
app.get("/keep-alive", (req, res) => {
  res.send("Server is alive.");
});


const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Discord = require("discord.js")
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const prefix =  "cc";

const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
  // console.log(folder);
  // if(folder === "utility") continue;
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    
      const command = require(`./commands/${folder}/${file}`);
      // if(file === "price.js")
      // console.log(command);
     
      client.commands.set(command.name, command);
  }
}



client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate',async(message) => {
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
  // console.log(message.content);
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // console.log(args);
  let commandName = 'q';
  
  commandName = args.shift().toLowerCase();
  console.log(commandName);

  // if(args.length === 0 && commandName !== 'f' ){
  //   const reply = new Discord.EmbedBuilder()
  //   .setTitle('No Asset Entered')
  //   .setColor('Red')
  //   .setDescription(`Format of the command is \`\`\` cc${commandName} [Symbol] <Currency>\`\`\``)

  //   return message.reply({embeds : [reply]});
  // }
  // console.log()

  const command = client.commands.get(commandName) ||
  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  console.log(command);

  if (!command) return;
  
  try {
    command.execute(client, message, args);
  } catch (error) {
      console.error(error);
      const reply = new Discord.MessageEmbed()
          .setAuthor('Error #X', process.env.CROSSICON)
          .setColor('#ff6961')
          .setTitle('Unknown error')
          .setDescription('Failed to execute command! ```' + error + '```')
          .setFooter('Please contact the developer about this so it can be solved ASAP!')
          .setTimestamp();

      return message.reply(reply);
  }

})



client.login(token);

