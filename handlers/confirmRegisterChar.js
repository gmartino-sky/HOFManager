// File: handlers/confirmRegisterChar.js

const db = require('../db/database');

async function handleRegisterCharModal(interaction) {
    if (interaction.customId !== 'register_char_modal') return;

    const discordUserId = interaction.user.id;
    const discordUsername = interaction.user.tag;

    const name = interaction.fields.getTextInputValue('character_name').trim();
    const type = interaction.fields.getSelectMenuValues('character_type')[0];
    const clan = interaction.fields.getSelectMenuValues('character_clan')[0];

    let users = (await db.get('users')) || [];

    const userIndex = users.findIndex(u => u.discord_user_id === discordUserId);

    if (userIndex === -1) {
        // New user
        users.push({
            discord_user_id: discordUserId,
            discord_username: discordUsername,
            characters: [{ name, type, clan }]
        });
    } else {
        const user = users[userIndex];

        if (type === 'main') {
            // Remove old main if exists
            user.characters = user.characters.filter(c => c.type !== 'main');
        }

        // Remove existing character with same name
        user.characters = user.characters.filter(c => c.name !== name);

        // Add new character
        user.characters.push({ name, type, clan });

        users[userIndex] = user;
    }

    await db.set('users', users);

    await interaction.reply({
        content: `✅ Character **${name}** registered as **${type.toUpperCase()}** in **${clan}**.`,
        ephemeral: true
    });
}

module.exports = { handleRegisterCharModal };
