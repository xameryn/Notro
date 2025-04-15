const config = {
    development: {
        enabled: true,
        guildId: process.env.GUILD_ID,
    },
    commands: {
        prefix: '?',
        message_commands: true,
        application_commands: {
            chat_input: true,
            user_context: true,
            message_context: true
        }
    },
    users: {
        ownerId: process.env.CLIENT_ID,
        developers: ['314215806118526976', '153699168874004480', '674634922664656936'],
    },
    messages: {
        NOT_BOT_OWNER: 'You do not have the permission to run this command because you\'re not the owner of me!',
        NOT_BOT_DEVELOPER: 'You do not have the permission to run this command because you\'re not a developer of me!',
        NOT_GUILD_OWNER: 'You do not have the permission to run this command because you\re not the guild owner!',
        CHANNEL_NOT_NSFW: 'You cannot run this command in a non-NSFW channel!',
        MISSING_PERMISSIONS: 'You do not have the permission to run this command, missing permissions.',
        COMPONENT_NOT_PUBLIC: 'You are not the author of this button!',
        GUILD_COOLDOWN: 'You are currently in cooldown, you have the ability to re-use this command again in \`%cooldown%s\`.'
    }
}

module.exports = config;