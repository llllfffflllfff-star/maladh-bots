const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

// 1. سيرفر للحفاظ على بقاء البوت (Keep-alive)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

// 2. البيانات الخاصة بك
const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, guildId: '1505700340392263720', channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, guildId: '1505700340392263720', channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, guildId: '1505700340392263720', channelId: '1515803958344417310' }
];

// 3. دالة تشغيل البوت
function startBot(config) {
    if (!config.token) {
        console.error(`خطأ: التوكن غير موجود لـ ${config.name}`);
        return;
    }

    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.once('ready', () => {
        console.log(`تم تشغيل ${config.name} بنجاح!`);
        // هنا تقدر تضيف كود الدخول للروم الصوتي إذا تبي
    });

    client.login(config.token);
}

// تشغيل البوتات الثلاثة
botsConfig.forEach(startBot);
