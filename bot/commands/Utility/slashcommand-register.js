const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'register-server',
        description: 'Pulls media from the server',
        type: 1,
        options: [
            {
                name: 'instance-address',
                description: 'The address of the instance you want to register this server to',
                type: 3,
                required: true
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
            const guildId = interaction.guildId;
            console.log('Guild ID from interaction:', guildId);
            
            if (!guildId) {
                await interaction.reply({ 
                    content: 'This command can only be used in a server'
                });
                return;
            }
            
            const guild = interaction.guild;
            
            if (!guild) {
                await interaction.reply({
                    content: 'Could not find server information. Please try again later.'
                });
                return;
            }

            const instanceId = interaction.user.id;
            const instanceAddress = interaction.options.getString('instance-address');
            const serverID = guildId;
            const serverName = guild.name;
            const iconUrl = guild.iconURL() || '';
            const port = instanceAddress.split(':')[1] || 4000;
            const targetAddress = interaction.options.getBoolean('is-local') ? `http://localhost:${port}` : instanceAddress;

            console.log('Attempting to register server with:');
            console.log('- Server ID:', serverID);
            console.log('- Server Name:', serverName);
            console.log('- Target Address:', `${process.env.FILE_SERVER_URL}/api/register/${instanceId}/${serverID}`);
            
            const response = await fetch(
                `${process.env.FILE_SERVER_URL}/api/register/${instanceId}/${serverID}?name=${encodeURIComponent(serverName)}&icon=${encodeURIComponent(iconUrl)}&address=${encodeURIComponent(instanceAddress)}`
            );
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            await interaction.reply({
                content: 'Server registered successfully!'
            });
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