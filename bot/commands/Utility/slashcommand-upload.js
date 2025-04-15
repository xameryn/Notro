const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Ensure this is installed
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const File = require('../../../server/models/fileModel'); // Adjust the path to your File model

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
                name: 'description',
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
            const description = interaction.options.getString('description') || 'No description provided';

            if (!fileAttachment) {
                await interaction.reply({
                    content: 'No file was provided. Please attach a file to upload.',
                    ephemeral: true
                });
                return;
            }

            console.log('Uploading file:', fileAttachment.name);

            // Save file locally
            const filePath = path.join(__dirname, '../../../server/files', fileAttachment.name);

            // Fetch the file content
            const response = await fetch(fileAttachment.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch the file: ${response.statusText}`);
            }

            // Use arrayBuffer to get the file content
            const arrayBuffer = await response.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filePath, fileBuffer);

            console.log('File saved to:', filePath);

            // Extract metadata
            const fileMetadata = {
                _id: uuidv4(), // Generate a unique ID
                name: fileAttachment.name,
                type: fileAttachment.contentType || 'unknown', // MIME type
                extension: path.extname(fileAttachment.name).substring(1), // File extension
                size: fileAttachment.size,
                serverFile: false, // Default value
                tagList: [], // Default empty tag list
            };

            // Save metadata to MongoDB
            const newFile = new File(fileMetadata);
            await newFile.save();

            console.log('File metadata saved to MongoDB:', fileMetadata);

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