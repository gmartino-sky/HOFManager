// File: commands/weekReport.js

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDonationsByWeek } = require('../db/donations');
const { formatWeek } = require('../utils/date');
const { getMainCharacters } = require('../db/users'); // to be implemented in db/users.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report-week') // User-facing name (stays the same)
        .setDescription('View the donation report for the current week')
        .setDefaultMemberPermissions(0), // We'll restrict this later to specific roles (ClanLeader)

    async execute(interaction) {
        const currentWeek = formatWeek(new Date().toISOString());

        // Retrieve all main characters
        const mainCharacters = await getMainCharacters();

        // Retrieve donations for the current week
        const donations = await getDonationsByWeek(currentWeek);

        // Build a set of donated characters
        const donatedCharacters = new Set(donations.map(donation => donation.character));

        // Find which Mains have not donated
        const missingCharacters = mainCharacters.filter(main => !donatedCharacters.has(main.character_name));

        const reportEmbed = new EmbedBuilder()
            .setTitle(`Weekly Donation Report - ${currentWeek}`)
            .setColor(0x3498db)
            .addFields(
                { name: '✅ Donations registered', value: `${mainCharacters.length - missingCharacters.length}/${mainCharacters.length}`, inline: true },
                { name: '🔴 Missing donations', value: `${missingCharacters.length}`, inline: true }
            );

        if (missingCharacters.length > 0) {
            const missingList = missingCharacters.map(mc => `• ${mc.character_name}`).join('\n');
            reportEmbed.addFields({ name: 'Characters missing donation', value: missingList });
        }

        const exportButton = new ButtonBuilder()
            .setCustomId('exportCsv')
            .setLabel('📂 Export CSV')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(exportButton);

        await interaction.reply({
            embeds: [reportEmbed],
            components: [actionRow],
            ephemeral: true
        });
    }
};

