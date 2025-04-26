const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserCharacters } = require('../db/users');
const { getDonationsByUser } = require('../db/donations');
const { formatWeek } = require('../utils/date');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history-user')
        .setDescription('View your donation history for the past 4 weeks'),

    async execute(interaction) {
        // tu código del comando
    }
};
