
import {Client, IntentsBitField, EmbedBuilder} from "discord.js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
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

// Function to fetch file by name from the server API
async function fetchFileByName(fileName) {
    try {
        const response = await fetch(`http://localhost:4000/api/files/${fileName}`);
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return {
                success: false,
                error: `HTTP error! status: ${response.status}`
            };
        }

        const fileData = await response.json();
        console.log("API Response:", fileData);

        return {
            success: true,
            file: fileData
        };
    } catch (error) {
        console.error("Error fetching file:", error);
        return {
            success: false,
            error: error.message
        };
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
        try {
            const fileName = interaction.options.get('file-name')?.value;
            if (!fileName) {
                await interaction.reply("Please provide a file name.");
                return;
            }

            console.log("File Name:", fileName);

            const result = await fetchFileByName(fileName);

            if (!result.success || !result.file) {
                await interaction.reply(result.error || "I couldn't find the file with that name.");
                return;
            }

            const file = result.file;
            console.log("✅✅ FILE:", file);

            // Make sure the file URL is correct and accessible
            const fileUrl = `http://localhost:4000/files/${file._id}${file.extension}`;
            console.log("Image URL:", fileUrl); // Log the URL for debugging

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(file.name || 'Fetched File')
                .setImage(fileUrl) 
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in fetch command:", error);
            await interaction.reply("An error occurred while processing your request.");
        }
    }

    if (interaction.commandName === 'connect') {
        try {
            const serverId = interaction.guild.id;
            const instanceId = interaction.user.id; // Using user ID as instance ID
            
            console.log("Instance ID:", instanceId);
            console.log("Server ID:", serverId);
            

            // // Validate IDs
            // if (!mongoose.Types.ObjectId.isValid(instanceId) || !mongoose.Types.ObjectId.isValid(serverId)) {
            //     await interaction.reply("Invalid instance or server IDDD format.");
            //     return;
            // }

            const response = await fetch(`http://localhost:4000/api/connect/${instanceId}/${serverId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userList: [interaction.user.id] }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                await interaction.reply(errorData.error || "Failed to connect server to instance.");
                return;
            }

            const result = await response.json();
            await interaction.reply(result.message);
        } catch (error) {
            console.error("Error connecting server to instance:", error);
            await interaction.reply("An error occurred while connecting server to instance.");
        }
    }

});

client.login(process.env.TOKEN);
