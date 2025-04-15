const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require('fs');
const path = require('path');


module.exports = new ApplicationCommand({
    command: {
        name: 'list',
        description: 'Lists all files',
        type: 1,
        options: []
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {

            const user = interaction.user;
            const apiServerUrl = process.env.FILE_SERVER_URL;

            const response = await fetch(`${apiServerUrl}/api/files/user/${user.id}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch files: ${response.statusText}`);
            }

            const data = await response.json();

            console.log("Fetched user files:", data);

            const files = data || [];
            const fileNames = files.map(file => file.name || 'Unknown File').join('\n');
            const fileList = files.length ? fileNames : 'No files found.';

            // embed message
            const embed = new EmbedBuilder()
                .setTitle('Saved Files')
                .setDescription(fileList)
                .setColor(0x0099FF)
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to list files:', error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Failed to list files: ${error.message}`
                });
            } else {
                await interaction.reply({
                    content: `Failed to list files: ${error.message}`
                });
            }
        }
    }
}).toJSON();