// File: commands/changeMain.js

const { SlashCommandBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change-main')
        .setDescription('Set a new character as your main')
        .addStringOption(option =>
            option.setName('character')
                .setDescription('The name of your new main character')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.tag;
        const newMainName = interaction.options.getString('character');

        const users = (await db.get('users')) || [];
        const userIndex = users.findIndex(u => u.discord_user_id === userId);

        if (userIndex === -1) {
            // No record yet for this user, create new one
            users.push({
                discord_user_id: userId,
                discord_username: username,
                characters: [
                    { name: newMainName, type: 'main' }
                ]
            });
        } else {
            const user = users[userIndex];

            // Remove previous main
            user.characters = user.characters.filter(c => c.type !== 'main');

            const altIndex = user.characters.findIndex(c => c.name === newMainName);

            if (altIndex !== -1) {
                // Promote existing alt to main
                user.characters.splice(altIndex, 1); // remove as alt
            }

            // Add new main
            user.characters.push({
                name: newMainName,
                type: 'main'
            });

            users[userIndex] = user;
        }

        await db.set('users', users);

        await interaction.reply({
            content: `✅ Your new main character is now **${newMainName}**.`,
            ephemeral: true
        });
    }
};
