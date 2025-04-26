// Import necesario al principio:
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserCharacters } = require('../db/users');
const { getDonationsByUser } = require('../db/donations');
const { DateTime } = require('luxon');

function generateLast4Weeks() {
    const weeks = [];
    let now = DateTime.now().setZone('America/Sao_Paulo');

    for (let i = 0; i < 4; i++) {
        const targetWeek = now.minus({ weeks: i });
        const saturday = targetWeek.endOf('week').minus({ days: 1 });
        const formatted = `Week ending ${saturday.toFormat('dd')} - ${saturday.toFormat('LLLL')}`;
        weeks.push(formatted);
    }

    return weeks;
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('history-user')
        .setDescription('View your character donation history.'),

    async execute(interaction) {
        const discordUserId = interaction.user.id;
        const characters = await getUserCharacters(discordUserId);

        if (!characters.length) {
            return await interaction.reply({
                content: '❌ No characters found linked to your account.',
                ephemeral: true
            });
        }

        const donations = await getDonationsByUser(discordUserId);
        const last4Weeks = generateLast4Weeks();

        const embed = new EmbedBuilder()
            .setTitle('Your Donation History')
            .setColor(0x00AE86);

        const fields = [];

        const orderedCharacters = [
            ...characters.filter(c => c.type === 'main'),
            ...characters.filter(c => c.type === 'alt')
        ];

        orderedCharacters.forEach(character => {
            fields.push({
                name: `${character.name} (${character.type.toUpperCase()})`,
                value: last4Weeks.map(week => {
                    const donated = donations.some(d => d.week === week && d.character === character.name);
                    return `${donated ? '✅' : '❌'} ${week}`;
                }).join('\n'),
                inline: false
            });
        });

        // console.log('✅ DEBUG fields array:', fields);


        embed.addFields(fields);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
