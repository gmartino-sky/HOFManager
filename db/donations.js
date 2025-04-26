// File: db/donations.js

const db = require('./database');


/**
 * Saves a new donation into the database.
 * @param {object} donationData - Donation data to save
 */
async function saveDonation(donationData) {
    const donations = (await db.get('donations')) || [];

    donations.push(donationData);

    await db.set('donations', donations);
}

/**
 * Retrieves all donations for a specific week.
 * @param {string} week - Week identifier (e.g., "Week 17 - April")
 * @returns {array} - List of donation objects
 */
async function getDonationsByWeek(week) {
    const donations = (await db.get('donations')) || [];
    return donations.filter(donation => donation.week === week);
}

/**
 * Retrieves all donations for a specific user.
 * @param {string} discordUserId - Discord user ID
 * @returns {array} - List of donation objects
 */
async function getDonationsByUser(discordUserId) {
    const donations = (await db.get('donations')) || [];
    return donations.filter(donation => donation.discord_user_id === discordUserId);
}

/**
 * Deletes all donation records older than the allowed retention period.
 * Retention: last 4 weeks (1 month approx.)
 */
async function cleanOldDonations() {
    const donations = (await db.get('donations')) || [];
    const currentDate = new Date();
    const retentionPeriodInMs = 1000 * 60 * 60 * 24 * 7 * 4; // 4 weeks

    const filtered = donations.filter(donation => {
        const donationTimestamp = new Date(donation.timestamp).getTime();
        return currentDate.getTime() - donationTimestamp <= retentionPeriodInMs;
    });

    await db.set('donations', filtered);
}

module.exports = {
    saveDonation,
    getDonationsByWeek,
    getDonationsByUser,
    cleanOldDonations
};
