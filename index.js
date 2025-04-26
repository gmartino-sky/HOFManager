// File: index.js

require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { handleDonationModal } = require('./handlers/confirmDonation');
const { handleDonationConfirmation } = require('./handlers/confirmButton');
const { handleExportCsv } = require('./handlers/exportCsv');
const { startDailyReminder } = require('./cron/dailyReminder');

// Load Slash Commands
const donationCommand = require('./commands/donation');
const weekReportCommand = require('./commands/weekReport');
const historyUserCommand = require('./commands/historyUser');
const changeMainCommand = require('./commands/changeMain');
const dailyCommand = require('./commands/daily');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel] // Needed for DMs
});

// Register commands in memory
client.commands = new Collection();
client.commands.set(donationCommand.data.name, donationCommand);
client.commands.set(weekReportCommand.data.name, weekReportCommand);
client.commands.set(historyUserCommand.data.name, historyUserCommand);
client.commands.set(changeMainCommand.data.name, changeMainCommand);
client.commands.set(dailyCommand.data.name, dailyCommand);

// Bot ready event
client.once('ready', () => {
    console.log(`🤖 HOF Manager is now running as ${client.user.tag}`);
    startDailyReminder(client); // Start the daily cronjob at 00:00 GMT-2
});

// Interaction handling
client.on('interactionCreate', async (interaction) => {
    try {
        // Slash commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await command.execute(interaction);
        }

        // Modal submit
        if (interaction.isModalSubmit()) {
            await handleDonationModal(interaction);
        }

        // Buttons
        if (interaction.isButton()) {
            await handleDonationConfirmation(interaction);
            await handleExportCsv(interaction);
        }

    } catch (error) {
        console.error('❌ Error handling interaction:', error);
        const errorMsg = '❌ An error occurred while executing the command.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMsg, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMsg, ephemeral: true });
        }
    }
});

// Login
client.login(process.env.BOT_TOKEN);

