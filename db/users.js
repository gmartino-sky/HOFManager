// File: db/users.js

const db = require('../db/database');

async function getUserCharacters(discordUserId) {
    const usersRaw = await db.get('users');
    const users = Array.isArray(usersRaw) ? usersRaw : (usersRaw?.value || []);

    const user = users.find(u => u.discord_user_id === discordUserId);

    return user ? user.characters : [];
}

async function getMainCharacters() {
    const usersRaw = await db.get('users');
    const users = Array.isArray(usersRaw) ? usersRaw : (usersRaw?.value || []);

    const mainCharacters = [];

    for (const user of users) {
        if (user.characters) {
            const main = user.characters.find(c => c.type === 'main');
            if (main) {
                mainCharacters.push({
                    discord_user_id: user.discord_user_id,
                    discord_username: user.discord_username,
                    name: main.name,
                    clan: main.clan
                });
            }
        }
    }

    return mainCharacters;
}

module.exports = {
    getUserCharacters,
    getMainCharacters
};
