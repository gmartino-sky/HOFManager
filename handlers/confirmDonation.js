// File: handlers/confirmDonation.js

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { validateDonationDate, formatWeek } = require('../utils/date');

async function handleDonationModal(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'donationModal') return;

    const characterName = interaction.fields.getTextInputValue('characterName');
    const donationMethod = interaction.fields.getSelectMenuValues('donationMethod')?.[0];
    const clan = interaction.fields.getSelectMenuValues('clan')?.[0];
    let donationDate = interaction.fields.getTextInputValue('donationDate') || new Date().toISOString().slice(0, 10);

    // Validate donation date
    const isDateValid = validateDonationDate(donationDate);
    if (!isDateValid) {
        return interaction.reply({
            content: '❌ Invalid donation date. It must be within the current week and not in the future.',
            ephemeral: true
        });
    }

    // Format week info
    const week = formatWeek(donationDate);

    // Create confirmation Embed
    const confirmationEmbed = new EmbedBuilder()
        .setTitle('Confirm your Donation Details')
        .addFields(
            { name: 'Character', value: characterName, inline: true },
            { name: 'Method', value: donationMethod, inline: true },
            { name: 'Clan', value: clan, inline: true },
            { name: 'Donation Date', value: donationDate, inline: false },
            { name: 'Week', value: week, inline: false }
        )
        .setColor(0x00FF00);

    const confirmButton = new ButtonBuilder()
        .setCustomId('confirmDonation')
        .setLabel('✅ Confirm')
        .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancelDonation')
        .setLabel('❌ Cancel')
        .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    await interaction.reply({
        embeds: [confirmationEmbed],
        components: [actionRow],
        ephemeral: true
    });

    // We wait for the button interaction later in another handler
}

module.exports = { handleDonationModal };
