// File: handlers/confirmButton.js

const { saveDonation } = require('../db/donations');

async function handleDonationConfirmation(interaction) {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;

    if (customId === 'confirmDonation') {
        // Extract data from the original message (embed fields)
        const embed = interaction.message.embeds[0];
        if (!embed) {
            return interaction.reply({ content: '❌ Unable to retrieve donation details.', ephemeral: true });
        }

        const fields = embed.fields.reduce((acc, field) => {
            acc[field.name.toLowerCase().replace(' ', '_')] = field.value;
            return acc;
        }, {});

        // Prepare data to save
        const donationData = {
            discord_user_id: interaction.user.id,
            discord_username: interaction.user.tag,
            character: fields.character,
            method: fields.method,
            clan: fields.clan,
            donation_date: fields.donation_date,
            week: fields.week,
            timestamp: new Date().toISOString()
        };

        // Save the donation to the database
        await saveDonation(donationData);

        // Reply success
        await interaction.update({
            content: '✅ Your donation has been successfully registered. Thank you!',
            components: [],
            embeds: []
        });

    } else if (customId === 'cancelDonation') {
        // Cancel donation process
        await interaction.update({
            content: '❌ Donation cancelled. No data has been saved.',
            components: [],
            embeds: []
        });
    }
}

module.exports = { handleDonationConfirmation };
