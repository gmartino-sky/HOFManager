// File: commands/registerChar.js

const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

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

        const typeInput = new TextInputBuilder()
            .setCustomId('character_type')
            .setLabel('Character Type (main or alt)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const clanInput = new TextInputBuilder()
            .setCustomId('character_clan')
            .setLabel('Clan Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(nameInput);
        const row2 = new ActionRowBuilder().addComponents(typeInput);
        const row3 = new ActionRowBuilder().addComponents(clanInput);

        await interaction.showModal(modal.addComponents(row1, row2, row3));
    }
};
