
import {Client, IntentsBitField, EmbedBuilder} from "discord.js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import mongoose from "mongoose";
import getFileById from '../server/serverManagment/serverBotFunctions.js';



dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Fetch the file from the external getFileById function
async function getFileByIdFromDb(fileID) {
    try {
      const file = await getFileById(fileID);
      return file.success ? file.file : null;
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  }
  

client.on('ready', (c) => {
    console.log(`✅${c.user.username} is booting up...`)
})

client.on('messageCreate', (message) => {
    if(message.author.bot){
        return
    }

    if(message.content === 'hi'){
        message.reply('hello')
    }
})


async function fetchGif(query) {
    const url = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.API_KEY}&limit=50&media_filter=minimal`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if(!data.results || data.results.length === 0){
            return null;
        }

        const randomIndex = Math.floor(Math.random() * data.results.length)
        return data.results[randomIndex].media_formats.gif.url;
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

client.on('interactionCreate', async(interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'ping'){
        interaction.reply('Pong!')
    }

    if(interaction.commandName === "gif"){

        // Sets description empty if not provided
        const gifDescription = interaction.options.get('description')?.value || " ";
        const gifName = interaction.options.get('gif-name').value


        const gifUrl = await fetchGif(gifName)
        if(!gifUrl){
            await interaction.reply("I must be blind cause I can't find it.")
            return
        }

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(gifName)
        .setImage(gifUrl)
        .setDescription(gifDescription);
        

       await interaction.reply({ embeds: [embed]});
    }

    if (interaction.commandName === 'fetch') {
        const fileId = interaction.options.get('file-id')?.value;
        console.log("File ID:", fileId);
    
        // Fetch the file from database using the existing getFileById function
        const file = await getFileById(fileId);
        console.log("✅✅FILE" , file)
        if (!file) {
          await interaction.reply("I couldn't find the file with that ID.");
          return;
        }
        
        // Create an embed to display the file
        const embed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(file.name || 'Fetched File')  // Assuming file has a 'name' field
          .setDescription(file.description || 'No description available')
          .setImage(file.url) // Assuming 'file.url' contains the file URL. Adjust if it's different.
          .setFooter({text: `Requested by ${interaction.user.username}`})
          .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
      }


})

client.login(process.env.TOKEN);