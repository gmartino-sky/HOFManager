// File: commands/weekReport.js

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { DateTime } = require('luxon');
const { getMainCharacters } = require('../db/users');
const { getDonationsByWeek } = require('../db/donations');
const { createObjectCsvStringifier } = require('csv-writer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report-week')
        .setDescription('Generate a weekly donation report for all main characters.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const now = DateTime.now().setZone('America/Sao_Paulo');
        const saturday = now.endOf('week').minus({ days: 1 });
        const currentWeek = `Week ending ${saturday.toFormat('dd')} - ${saturday.toFormat('LLLL')}`;

        const mainCharacters = await getMainCharacters();
        const donations = await getDonationsByWeek(currentWeek);

        const donatedCharacterNames = donations.map(d => d.character);

        const charactersWhoDonated = [];
        const charactersMissingDonation = [];

        const fullCsvData = [];

        for (const main of mainCharacters) {
            const donation = donations.find(d => d.character === main.name);
            if (donation) {
                charactersWhoDonated.push(main.name);
                fullCsvData.push({
                    character_name: main.name,
                    discord_username: main.discord_username,
                    type: 'MAIN',
                    donation_status: 'Donated',
                    clan: donation.clan,
                    donation_date: donation.donation_date
                });
            } else {
                charactersMissingDonation.push(main.name);
                fullCsvData.push({
                    character_name: main.name,
                    discord_username: main.discord_username,
                    type: 'MAIN',
                    donation_status: 'Missing',
                    clan: '',
                    donation_date: ''
                });
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`Weekly Donation Report - ${currentWeek}`)
            .setColor(0x00AE86)
            .addFields(
                { name: '✅ Donations registered', value: `${charactersWhoDonated.length}/${mainCharacters.length}`, inline: true },
                { name: '🔴 Missing donations', value: `${charactersMissingDonation.length}`, inline: true },
                { name: 'Characters missing donation', value: charactersMissingDonation.length > 0 ? charactersMissingDonation.map(c => `• ${c}`).join('\n') : 'None' }
            );

        if (charactersWhoDonated.length > 0) {
            embed.addFields({
                name: '✅ Characters who donated:',
                value: charactersWhoDonated.map(c => `• ${c}`).join('\n'),
                inline: false
            });
        }

        if (charactersMissingDonation.length > 0) {
            embed.addFields({
                name: '🔴 Characters missing donation:',
                value: charactersMissingDonation.map(c => `• ${c}`).join('\n'),
                inline: false
            });
        }

        // Create CSV Stringifier
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'character_name', title: 'Character Name' },
                { id: 'discord_username', title: 'Discord Username' },
                { id: 'type', title: 'Type' },
                { id: 'donation_status', title: 'Donation Status' },
                { id: 'clan', title: 'Clan' },
                { id: 'donation_date', title: 'Donation Date' }
            ]
        });

        const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(fullCsvData);

        // Save the CSV content temporarily
        const csvBuffer = Buffer.from(csvContent, 'utf-8');

        // Prepare button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('export_csv')
                    .setLabel('📥 Export CSV')
                    .setStyle(ButtonStyle.Success)
            );

        // Save CSV in memory for the interaction
        interaction.client._csvExport = csvBuffer;

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};
