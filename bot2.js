const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', async () => {
    const guild = await client.guilds.fetch('1505700340392263720');
    const channel = await guild.channels.fetch('1515803830955151502');
    joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator, selfDeaf: false });
    console.log("Bot 2 Connected to Room 2");
});
client.login(process.env.TOKEN2);
