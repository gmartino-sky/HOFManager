// File: handlers/confirmDonation.js

const db = require('../db/database');
const { DateTime } = require('luxon');

async function handleDonationModal(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith('donation_modal')) return;

    const discordUserId = interaction.user.id;
    const discordUsername = interaction.user.tag;

    const character = interaction.fields.getTextInputValue('character_name').trim();
    const method = interaction.fields.getTextInputValue('donation_method').trim().toLowerCase();
    const clan = interaction.fields.getTextInputValue('clan_name').trim();
    const donationDateStr = interaction.fields.getTextInputValue('donation_date').trim();

    // Parse the date
    const donationDate = DateTime.fromISO(donationDateStr, { zone: 'America/Sao_Paulo' });

    if (!donationDate.isValid) {
        return await interaction.reply({
            content: '❌ Invalid date format. Please use YYYY-MM-DD.',
            ephemeral: true
        });
    }

    // Calculate the correct week ending based on the Saturday
    const saturday = donationDate.endOf('week').minus({ days: 1 });
    const week = `Week ending ${saturday.toFormat('dd')} - ${saturday.toFormat('LLLL')}`;

    const donationRecord = {
        discord_user_id: discordUserId,
        discord_username: discordUsername,
        character,
        method,
        clan,
        donation_date: donationDate.toISODate(),
        week,
        timestamp: new Date().toISOString()
    };

    let donationsRaw = await db.get('donations');
    const donations = Array.isArray(donationsRaw) ? donationsRaw : (donationsRaw?.value || []);

    donations.push(donationRecord);
    await db.set('donations', donations);

    await interaction.reply({
        content: `✅ Donation from **${character}** registered successfully for **${week}**.`,
        ephemeral: true
    });
}

module.exports = { handleDonationModal };
