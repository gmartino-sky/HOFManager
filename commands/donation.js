// File: commands/donation.js

const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const clans = require('../config/clans'); // Assuming you have a clans.js with fixed list

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donation')
        .setDescription('Register your weekly gold donation'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('donationModal')
            .setTitle('Register your Donation');

        const characterInput = new TextInputBuilder()
            .setCustomId('characterName')
            .setLabel('Character Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const donationMethodInput = new SelectMenuBuilder()
            .setCustomId('donationMethod')
            .setPlaceholder('Select Donation Method')
            .addOptions([
                { label: 'Direct', value: 'direct' },
                { label: 'Marketplace', value: 'marketplace' }
            ]);

        const clanInput = new SelectMenuBuilder()
            .setCustomId('clan')
            .setPlaceholder('Select Clan')
            .addOptions(
                clans.map(clan => ({
                    label: clan.name,
                    value: clan.id
                }))
            );

        const donationDateInput = new TextInputBuilder()
            .setCustomId('donationDate')
            .setLabel('Donation Date (YYYY-MM-DD)')
            .setPlaceholder('Defaults to today if empty')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Group components into Action Rows
        const firstRow = new ActionRowBuilder().addComponents(characterInput);
        const secondRow = new ActionRowBuilder().addComponents(donationMethodInput);
        const thirdRow = new ActionRowBuilder().addComponents(clanInput);
        const fourthRow = new ActionRowBuilder().addComponents(donationDateInput);

        modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);

        await interaction.showModal(modal);
    }
};
