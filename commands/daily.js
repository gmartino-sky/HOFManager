// File: commands/daily.js

const { SlashCommandBuilder } = require('discord.js');
const { ClanLeaderRoleId } = require('../config/roles');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Send a daily reminder to specific clan members')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('First user to remind')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('Second user to remind')
                .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('user3')
                .setDescription('Third user to remind')
                .setRequired(false)
        ),

    async execute(interaction) {
        const member = interaction.member;

        console.log('User roles:', member.roles.cache.map(role => role.id));
        console.log('Required ClanLeaderRoleId:', ClanLeaderRoleId);

        if (!member.roles.cache.has(ClanLeaderRoleId)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const targets = [];
        for (let i = 1; i <= 3; i++) {
            const user = interaction.options.getUser(`user${i}`);
            if (user) targets.push(user);
        }

        if (targets.length === 0) {
            return interaction.reply({
                content: '⚠️ You must select at least one user.',
                ephemeral: true
            });
        }

        let success = 0;
        for (const user of targets) {
            try {
                const reminderMessage =
                    `📣 Hey ${user.username}! Don’t forget to complete your daily donations today. The clan depends on you! 🙌
📣 ¡Hola ${user.username}! No olvides completar tus donaciones diarias hoy. ¡El clan depende de ti! 🙌
📣 嘿 ${user.username}！今天不要忘记完成你的每日捐赠。公会需要你！🙌`;

                await user.send(reminderMessage);
                success++;
            } catch (err) {
                console.error(`❌ Failed to DM ${user.tag}`, err);
            }
        }

        await interaction.reply({
            content: `✅ Sent daily reminders to ${success}/${targets.length} users.`,
            ephemeral: true
        });
    }
};
