const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'link',
        description: 'Provides a link to the application',
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
            const linkUrl = "http://localhost:5173";

            // Create an embed message
            const embed = new EmbedBuilder()
                .setTitle('Notro')
                .setDescription(`[Go to Notro](${linkUrl})`)
                .setColor(0x0099FF)
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Failed to send link:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Failed to send the link: ${error.message}`
                });
            } else {
                await interaction.reply({
                    content: `Failed to send the link: ${error.message}`
                });
            }
        }
    }
}).toJSON();