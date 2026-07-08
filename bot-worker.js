// Runs a single bot in an isolated process
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const token     = process.env.BOT_TOKEN;
const guildId   = process.env.BOT_GUILD_ID;
const channelId = process.env.BOT_CHANNEL_ID;
const label     = process.env.BOT_LABEL;

if (!token || !guildId || !channelId) {
    console.error(`${label}: missing env vars`);
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let retryTimer = null;

async function connect(guild) {
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }

    console.log(`${label}: joining channel ${channelId}...`);

    const conn = joinVoiceChannel({
        channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true,
    });

    try {
        await entersState(conn, VoiceConnectionStatus.Ready, 20_000);
        const channel = guild.channels.cache.get(channelId);
        console.log(`${label}: connected to "${channel?.name ?? channelId}" successfully.`);
    } catch {
        console.log(`${label}: timed out reaching Ready — retrying in 5s...`);
        conn.removeAllListeners();
        try { conn.destroy(); } catch (_) {}
        retryTimer = setTimeout(() => connect(guild), 5000);
        return;
    }

    conn.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(conn, VoiceConnectionStatus.Signalling, 5_000),
                entersState(conn, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch {
            console.log(`${label}: disconnected — retrying in 5s...`);
            conn.removeAllListeners();
            try { conn.destroy(); } catch (_) {}
            retryTimer = setTimeout(() => connect(guild), 5000);
        }
    });
}

client.once('clientReady', async () => {
    console.log(`${label}: logged in as ${client.user.tag}`);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        console.error(`${label}: guild ${guildId} not found`);
        process.exit(1);
    }
    await connect(guild);
});

client.login(token).catch(err => {
    console.error(`${label}: login failed — ${err.message}`);
    process.exit(1);
});
