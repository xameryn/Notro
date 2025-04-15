const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'notro',
        description: 'Fetches and posts a media file from the server in an embed.',
        type: 1,
        options: [
            {
                name: 'filename',
                description: 'The file name',
                type: 3,
                required: true
            }
        ]
    },
    options: {
        cooldown: 5000
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const serverID = interaction.guildId;
        const userID = interaction.user.id;
        const fileName = interaction.options.getString('filename');

        try {
            const response = await fetch(`${process.env.FILE_SERVER_URL}/api/files/${serverID}/${userID}/${fileName}`);
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            const file = data.file;
            const fileUrl = `${process.env.REMOTE_ADDRESS}/files/${file._id}${file.extension}`;

            const embed = new EmbedBuilder()
                .setTitle(`${fileName}`)
                .setDescription(`Requested by <@${userID}>`)
                .setURL(fileUrl);

            if (file.type === 'image') {
                embed.setImage(fileUrl);
            } else {
                embed.setDescription(embed.data.description + '\n[Download file](' + fileUrl + ')');
            }

            if (file.type === 'video') {
                await interaction.reply({ content: `[${fileName}](${fileUrl})` });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Failed to register server:', error);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Failed to register server: ${error.message}`
                });
            } else {
                await interaction.reply({
                    content: `Failed to register server: ${error.message}`
                });
            }
        }
    }
}).toJSON();
