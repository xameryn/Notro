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
           
            const directoryPath = path.join(__dirname, '../../../server/files');

            // Check if the directory exists
            if (!fs.existsSync(directoryPath)) {
                await interaction.reply({
                    content: 'The directory does not exist.',
                    ephemeral: true
                });
                return;
            }

            // Read the files in the directory
            const files = fs.readdirSync(directoryPath, { withFileTypes: true });

            // Filter out files in the "thumbnails" folder
            const filteredFiles = files
                .filter(file => file.name !== 'thumbnails' && !file.name.startsWith('thumbnails/'))
                .map(file => file.name);

            if (filteredFiles.length === 0) {
                await interaction.reply({
                    content: 'No files found in the directory (excluding "thumbnails").',
                    ephemeral: true
                });
                return;
            }

            // formatted list of file names
            const fileList = filteredFiles.map((file, index) => `${index + 1}. ${file}`).join('\n');

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