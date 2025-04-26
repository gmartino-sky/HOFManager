// File: handlers/exportCsv.js

const { AttachmentBuilder } = require('discord.js');
const { getDonationsByWeek } = require('../db/donations');
const { formatWeek } = require('../utils/date');
const { stringify } = require('csv-stringify/sync');

async function handleExportCsv(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'exportCsv') return;

    const currentWeek = formatWeek(new Date().toISOString());

    const donations = await getDonationsByWeek(currentWeek);

    if (!donations || donations.length === 0) {
        return await interaction.reply({
            content: '⚠️ No donations found for this week.',
            ephemeral: true
        });
    }

    // Prepare CSV data
    const csvData = stringify(donations, {
        header: true,
        columns: {
            discord_user_id: 'Discord User ID',
            discord_username: 'Discord Username',
            character: 'Character Name',
            method: 'Donation Method',
            clan: 'Clan',
            donation_date: 'Donation Date',
            week: 'Week',
            timestamp: 'Timestamp'
        }
    });

    const buffer = Buffer.from(csvData, 'utf-8');

    const attachment = new AttachmentBuilder(buffer, {
        name: `donations_${currentWeek.replace(/ /g, '_')}.csv`
    });

    await interaction.reply({
        content: '📂 Here is the donation report in CSV format:',
        files: [attachment],
        ephemeral: true
    });
}

module.exports = { handleExportCsv };
