const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// تعريف أمر /org
const commands = [
    new SlashCommandBuilder()
        .setName('org')
        .setDescription('Creates an organizational channel')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

// تسجيل الأوامر
(async () => {
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Security: طرد الأعضاء بدون صورة شخصية
client.on('guildMemberAdd', async member => {
    if (!member.avatar && !member.user.avatar) {
        await member.kick('Security: No avatar detected.');
    }
});

// تنفيذ أمر /org
const ALLOWED_USER_ID = '1518389009221550100';

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.user.id !== ALLOWED_USER_ID) {
        await interaction.reply({ content: 'sorry you dont Mr abderahman', ephemeral: true });
        return;
    }

    if (interaction.commandName === 'org') {
        const channel = await interaction.guild.channels.create({
            name: 'organization',
            type: 0 // 0 يعني Text Channel
        });
        await interaction.reply(`Created organization channel: ${channel.name}`);
    }
});

client.login(token);