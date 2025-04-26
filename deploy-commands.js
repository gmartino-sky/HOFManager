// File: deploy-commands.js

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Load environment variables
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Read all command files
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`⚠️ Warning: The command at ${filePath} is missing "data" or "execute" properties.`);
    }
}

// Create REST instance
const rest = new REST().setToken(token);

// Deploy the commands
(async () => {
    try {
        console.log(`🛠️ Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log(`✅ Successfully reloaded all guild slash commands.`);
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
