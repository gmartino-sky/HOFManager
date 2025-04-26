// File: cron/dailyReminder.js

const cron = require('node-cron');
const { Client } = require('discord.js');
const { getDonationsByWeek } = require('../db/donations');
const { getMainCharacters } = require('../db/users');
const { formatWeek } = require('../utils/date');

// Main function that runs daily
async function runDailyReminder(client) {
    const currentWeek = formatWeek(new Date().toISOString());

    const donations = await getDonationsByWeek(currentWeek);
    const donatedCharacters = new Set(donations.map(d => d.character));

    const mainCharacters = await getMainCharacters();

    for (const main of mainCharacters) {
        if (!donatedCharacters.has(main.character_name)) {
            try {
                const user = await client.users.fetch(main.discord_user_id);
                await user.send(`📣 Remember to donate your gold this week! Your main character **${main.character_name}** hasn’t donated yet.`);
            } catch (err) {
                console.error(`❌ Failed to remind ${main.discord_username}`, err);
            }
        }
    }

    console.log(`✅ Daily reminder sent for week ${currentWeek}`);
}

// Schedule it to run every day at 00:00 (GMT-2)
function startDailyReminder(client) {
    cron.schedule('0 0 * * *', () => {
        runDailyReminder(client);
    }, {
        timezone: 'Etc/GMT+2'
    });
}

module.exports = { startDailyReminder };
