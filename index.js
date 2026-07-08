const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// سيرفر للبقاء نشطاً
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

// تم تعديل الـ configs بناءً على طلبك:
// بوت 1: الـ channelId فارغ لأنه لن يدخل أي روم
// بوت 2: سيدخل الروم رقم 3
// بوت 3: سيدخل الروم رقم 1
const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: null }, 
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: 'ايدي_روم_3' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: 'ايدي_روم_1' }
];

function startBot(config) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.on(Events.ClientReady, async () => {
        console.log(`${config.name} متصل!`);
        
        // شرط: إذا كان البوت رقم 1 أو لا يوجد channelId، لا تحاول الدخول
        if (!config.channelId) {
            console.log(`${config.name} (بوت 1) لن يدخل أي روم.`);
            return;
        }

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

// تشغيل البوتات
botsConfig.forEach(config => {
    if (config.token) {
        startBot(config);
    }
});
