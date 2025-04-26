// File: commands/donation.js

const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donation')
        .setDescription('Register a donation for your character'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('donation_modal')
            .setTitle('Register Donation');

        const characterInput = new TextInputBuilder()
            .setCustomId('character_name')
            .setLabel('Character Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const clanInput = new TextInputBuilder()
            .setCustomId('clan_name')
            .setLabel('Clan Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const methodInput = new TextInputBuilder()
            .setCustomId('donation_method')
            .setLabel('Donation Method (direct or market)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const dateInput = new TextInputBuilder()
            .setCustomId('donation_date')
            .setLabel('Donation Date (YYYY-MM-DD)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(characterInput);
        const row2 = new ActionRowBuilder().addComponents(clanInput);
        const row3 = new ActionRowBuilder().addComponents(methodInput);
        const row4 = new ActionRowBuilder().addComponents(dateInput);

        await interaction.showModal(modal.addComponents(row1, row2, row3, row4));
    }
};
