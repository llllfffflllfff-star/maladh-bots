const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// سيرفر للبقاء نشطاً
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

function startBot(config) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.on(Events.ClientReady, async () => {
        console.log(`${config.name} متصل!`);
        
        const channel = await client.channels.fetch(config.channelId).catch(() => null);
        if (!channel) {
            console.log(`خطأ: لم أجد الروم لـ ${config.name}`);
            return;
        }

        const connect = () => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });

            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5000),
                    ]);
                } catch (error) {
                    connection.destroy();
                    connect(); // إعادة الاتصال
                }
            });
            console.log(`${config.name} ثبت في الروم الخاص به.`);
        };

        connect();
    });

    client.login(config.token);
}

// تشغيل البوتات كـ عمليات منفصلة تماماً
botsConfig.forEach(config => {
    if (config.token) {
        startBot(config);
    }
});
