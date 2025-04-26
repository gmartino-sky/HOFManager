// File: handlers/confirmButton.js

const db = require('../db/database');

async function handleDonationConfirmation(interaction) {
    const { customId, user } = interaction;

    if (customId !== 'confirm_donation' && customId !== 'cancel_donation') return;

    const pendingKey = `pending_confirmation_${user.id}`;
    const pendingDonation = await db.get(pendingKey);

    // console.log('✅ DEBUG: pendingDonation data:', pendingDonation);

    if (!pendingDonation) {
        return await interaction.reply({
            content: '❌ No pending donation found. Please try again or resubmit your donation.',
            ephemeral: true
        });
    }

    const donation = pendingDonation.value || pendingDonation; // Support both formats

    if (customId === 'cancel_donation') {
        await db.delete(pendingKey);

        return await interaction.update({
            content: '❌ Donation canceled successfully.',
            components: []
        });
    }

    let donations = await db.get('donations');
    if (!Array.isArray(donations)) {
        donations = [];
    }

    donations.push(donation);
    await db.set('donations', donations);
    await db.delete(pendingKey);

    await interaction.update({
        content: `✅ Donation from **${donation.character}** successfully registered for **${donation.week}**.`,
        components: []
    });
}

module.exports = { handleDonationConfirmation };
