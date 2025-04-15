const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

module.exports = new ApplicationCommand({
    command: {
        name: 'upload',
        description: 'Uploads a file to the server',
        type: 1,
        options: [
            {
                name: 'file',
                description: 'The file to upload',
                type: 11, 
                required: true
            },
            {
                name: 'file-name',
                description: 'A description for the uploaded file',
                type: 3, 
                required: false
            }
        ]
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
            const fileAttachment = interaction.options.getAttachment('file');
            const name = interaction.options.getString('name') || 'No description provided';
    
            if (!fileAttachment) {
                await interaction.reply({
                    content: 'No file was provided. Please attach a file to upload.',
                    ephemeral: true
                });
                return;
            }
    
            // Download file from Discord
            const response = await fetch(fileAttachment.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch the file: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);
    
            const fileMetadata = {
                displayName: fileAttachment.name.split('.')[0],
                fileName: name || fileAttachment.name,
                type: fileAttachment.contentType || "unknown",
                tagList: '',
                serverFile: true,
                size: fileAttachment.size,
                userID: interaction.user.id,
                serverID: interaction.guildId
            };
    
            const form = new FormData();
            form.append('file', fileBuffer, {
                filename: fileAttachment.name,
                contentType: fileAttachment.contentType || "application/octet-stream",
                knownLength: fileBuffer.length
            });
            form.append('metadata', JSON.stringify(fileMetadata));
    
            const uploadResponse = await fetch(`${process.env.FILE_SERVER_URL}/api/upload`, {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });
    
            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || "Upload failed");
            }
    
            const result = await uploadResponse.json();
    
            await interaction.reply({
                content: `File uploaded successfully!\n**File Name:** ${fileAttachment.name}\n**Description:** ${description}`
            });
        } catch (error) {
            console.error('Failed to upload file:', error);
    
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Failed to upload file: ${error.message}`
                });
            } else {
                await interaction.reply({
                    content: `Failed to upload file: ${error.message}`
                });
            }
        }
    }
}).toJSON();