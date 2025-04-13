
import {REST, Routes, ApplicationCommandOptionType} from "discord.js";
import dotenv from 'dotenv';

dotenv.config();


// List of commands
const commands = [
    {
        name: 'ping',
        description: 'Pong!'

    },
    {
        name: 'gif',
        description: 'gif Embed test',
        options: [
            {
                name: 'gif-name',
                description: 'Search by gif name',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: 'Gif description',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    {
        name: 'fetch',
        description: 'Get file by Name',
        options: [
            {
                name: 'file-name',
                description: 'The Name of the file to fetch',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);


(async() => {
    try{
        // Send request to discord to register a command to a specific server
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands}
        )

        console.log("Registered command succesfully")
    }catch(e){
        console.log(`Error: ${e}`)
    }
})();