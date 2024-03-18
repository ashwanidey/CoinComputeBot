const fs = require('node:fs');
const path = require('node:path');

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
  if(folder === "utility") continue;
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      // if(file === "price.js")
     
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
  // console.log(commandName);

  // if(args.length === 0 && commandName !== 'f' ){
  //   const reply = new Discord.EmbedBuilder()
  //   .setTitle('No Asset Entered')
  //   .setColor('Red')
  //   .setDescription(`Format of the command is \`\`\` cc${commandName} [Symbol] <Currency>\`\`\``)

  //   return message.reply({embeds : [reply]});
  // }

  const command = client.commands.get(commandName) ||
  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  // console.log(command);

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

// client.on('messageCreate',(message) => {
//   if(message.author.bot) return;
//   message.reply({
//     content: "Test",
//   })
// })

// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;
// 	const command = interaction.client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}
// });

client.login(token);

