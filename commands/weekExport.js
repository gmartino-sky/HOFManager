// File: commands/historyUser.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserCharacters } = require('../db/users'); // to be implemented
const { getDonationsByUser } = require('../db/donations');
const { formatWeek } = require('../utils/date');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history-user')
        .setDescription('View your donation history for the past 4 weeks'),

    async execute(interaction) {
        const discordUserId = interaction.user.id;

        // Get user's Main and Alts
        const userCharacters = await getUserCharacters(discordUserId);

        if (!userCharacters || userCharacters.length === 0) {
            return await interaction.reply({
                content: '❌ No characters found linked to your account.',
                ephemeral: true
            });
        }

        // Get user's donations
        const userDonations = await getDonationsByUser(discordUserId);

        const weeksToCheck = generateLast4Weeks();

        const embed = new EmbedBuilder()
            .setTitle('Your Donation History')
            .setColor(0x00bcd4);

        for (const character of userCharacters) {
            let donationStatus = '';

            for (const week of weeksToCheck) {
                const donated = userDonations.find(donation =>
                    donation.character === character.character_name && donation.week === week
                );
                donationStatus += donated ? `✅ ${week}\n` : `❌ ${week}\n`;
            }

            embed.addFields({
                name: `${character.character_name} (${character.type.toUpperCase()})`,
                value: donationStatus,
                inline: false
            });
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

/**
 * Generates an array of last 4 weeks in format "Week XX - Month"
 */
function generateLast4Weeks() {
    const weeks = [];
    let date = new Date();

    for (let i = 0; i < 4; i++) {
        weeks.unshift(formatWeek(date.toISOString()));
        date.setDate(date.getDate() - 7); // Go back 7 days
    }

    return weeks;
}
