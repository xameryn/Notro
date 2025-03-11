
import {Client, IntentsBitField} from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is booting up...`)
})

client.on('messageCreate', (message) => {
    if(message.author.bot){
        return
    }

    if(message.content === 'hi'){
        message.reply('hello')
    }
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === "ping"){
        interaction.reply("Pong!")
    }
})

client.login(process.env.TOKEN);