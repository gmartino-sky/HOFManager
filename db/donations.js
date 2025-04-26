// File: db/donations.js

const db = require('./database');

async function getDonationsByUser(discordUserId) {
    let donationsRaw = await db.get('donations');
    const donations = Array.isArray(donationsRaw) ? donationsRaw : (donationsRaw?.value || []);

    return donations.filter(d => d.discord_user_id === discordUserId);
}

async function getDonationsByWeek(week) {
    let donationsRaw = await db.get('donations');
    const donations = Array.isArray(donationsRaw) ? donationsRaw : (donationsRaw?.value || []);

    return donations.filter(d => d.week === week);
}

module.exports = {
    getDonationsByUser,
    getDonationsByWeek
};
