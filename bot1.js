const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', async () => {
    const guild = await client.guilds.fetch('1505700340392263720');
    const channel = await guild.channels.fetch('1505724955143442605');
    joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator, selfDeaf: false });
    console.log("Bot 1 Connected to Room 1");
});
client.login(process.env.TOKEN1);
