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

async function startBot(config) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.on(Events.ClientReady, async () => {
        console.log(`✅ ${config.name} متصل!`);
        
        const channel = await client.channels.fetch(config.channelId).catch(() => null);
        if (!channel) {
            console.log(`❌ ${config.name}: لم يتم العثور على الروم.`);
            return;
        }

        const connect = () => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            console.log(`🔊 ${config.name} دخل الروم: ${channel.name}`);
        };

        connect();
    });

    client.login(config.token);
}

// تشغيل البوتات بفاصل زمني 5 ثواني لضمان استقلالية الاتصال لكل بوت
async function runBots() {
    for (const config of botsConfig) {
        if (config.token) {
            console.log(`⏳ جاري تشغيل ${config.name} بعد 5 ثواني...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            startBot(config);
        } else {
            console.log(`⚠️ تحذير: التوكن لـ ${config.name} غير موجود.`);
        }
    }
}

runBots();
