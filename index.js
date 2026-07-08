const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

function setupBot(config) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    const connectToChannel = () => {
        const channel = client.channels.cache.get(config.channelId);
        if (!channel) return;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            console.log(`${config.name} انطرد! بحاول أدخل الحين...`);
            try {
                await Promise.race([
                    connection.signalling(),
                    connection.connect(),
                ]);
            } catch (e) {
                connectToChannel(); // إعادة محاولة
            }
        });
    };

    client.on(Events.ClientReady, () => {
        console.log(`${config.name} جاهز!`);
        connectToChannel();
    });

    client.login(config.token);
}

botsConfig.forEach(setupBot);
