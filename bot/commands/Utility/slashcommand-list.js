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
            const remoteUrl = process.env.REMOTE_ADDRESS;

            const response = await fetch(`${apiServerUrl}/api/files/user/${user.id}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch files: ${response.statusText}`);
            }

            const data = await response.json();

            // console.log("Fetched user files:", data);

            const files = data || [];
            const imageFiles = files
                .filter(file => file.type == 'image')
                .map(file => `[${file.name}](${remoteUrl}/files/${file._id}${file.extension})`)
                .join(', ');
            const videoFiles = files
                .filter(file => file.type == 'video')
                .map(file => `[${file.name}](${remoteUrl}/files/${file._id}${file.extension})`)
                .join(', ');
            const otherFiles = files
                .filter(file => file.type != 'image' && file.type != 'video')
                .map(file => `[${file.name}](${remoteUrl}/files/${file._id}${file.extension})`)
                .join(', ');
            const fileList = `**Images:**\n${imageFiles || 'None'}\n\n**Videos:**\n${videoFiles || 'None'}\n\n**Other:**\n${otherFiles || 'None'}`;

            // embed message
            const embed = new EmbedBuilder()
                .setTitle('Saved Files')
                .setDescription(fileList)
                .setColor(0x0099FF)
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
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