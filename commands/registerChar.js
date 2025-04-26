// File: commands/registerChar.js

const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const clans = require('../config/clans');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register-char')
        .setDescription('Register a character (main or alt) with clan assignment'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('register_char_modal')
            .setTitle('Register Character');

        const nameInput = new TextInputBuilder()
            .setCustomId('character_name')
            .setLabel('Character Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(nameInput);

        const typeSelect = new SelectMenuBuilder()
            .setCustomId('character_type')
            .setPlaceholder('Select character type')
            .addOptions([
                { label: 'Main', value: 'main' },
                { label: 'Alt', value: 'alt' }
            ]);

        const clanSelect = new SelectMenuBuilder()
            .setCustomId('character_clan')
            .setPlaceholder('Select character clan')
            .addOptions(
                clans.map(clan => ({
                    label: clan.name,
                    value: clan.id
                }))
            );

        const row2 = new ActionRowBuilder().addComponents(typeSelect);
        const row3 = new ActionRowBuilder().addComponents(clanSelect);

        await interaction.showModal(modal.addComponents(row1, row2, row3));
    }
};
