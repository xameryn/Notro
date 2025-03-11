
import {REST, Routes} from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

const commands = [
    {
        name: 'ping',
        description: 'Pong!'

    }
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async() => {
    try{
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands}
        )

        console.log("Registered command succesfully")
    }catch(e){
        console.log(`Error: ${e}`)
    }
})();