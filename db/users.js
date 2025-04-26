// File: db/users.js

const db = require('./database');


/**
 * Retrieves all main characters from all users.
 * @returns {array} - List of main characters
 */
async function getMainCharacters() {
    const users = (await db.get('users')) || [];

    const mainCharacters = [];

    users.forEach(user => {
        user.characters.forEach(character => {
            if (character.type === 'main') {
                mainCharacters.push({
                    discord_user_id: user.discord_user_id,
                    discord_username: user.discord_username,
                    character_name: character.name
                });
            }
        });
    });

    return mainCharacters;
}

/**
 * Retrieves all characters (main and alts) for a specific user.
 * @param {string} discordUserId - Discord user ID
 * @returns {array} - List of character objects
 */
async function getUserCharacters(discordUserId) {
    const users = (await db.get('users')) || [];
    const user = users.find(u => u.discord_user_id === discordUserId);

    if (!user) {
        return [];
    }

    return user.characters.map(character => ({
        character_name: character.name,
        type: character.type // main or alt
    }));
}

module.exports = {
    getMainCharacters,
    getUserCharacters
};
