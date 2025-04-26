// File: handlers/exportCsv.js

const { AttachmentBuilder } = require('discord.js');

async function handleExportCsv(interaction) {
    if (interaction.customId !== 'export_csv') return; // Solo si es el botón de exportar

    if (interaction.client._csvExport) {
        const attachment = new AttachmentBuilder(interaction.client._csvExport, { name: 'weekly_donation_report.csv' });

        await interaction.reply({
            content: '📥 Here is your exported CSV:',
            files: [attachment],
            ephemeral: true
        });
    } else {
        await interaction.reply({
            content: '❌ No report available. Please run `/report-week` first.',
            ephemeral: true
        });
    }
}

module.exports = { handleExportCsv };
