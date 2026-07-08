const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// سيرفر للبقاء نشطاً
http.createServer((req, res) => res.end('Alive')).listen(process.env.PORT || 8080);

const botsData = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

// دالة لتشغيل كل بوت في "نطاق خاص به" (Scope)
async function boot(data) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
    
    client.on('ready', async () => {
        console.log(`✅ ${data.name} متصل!`);
        try {
            const channel = await client.channels.fetch(data.channelId);
            if (!channel) return;
            
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            console.log(`🔊 ${data.name} دخل الروم: ${channel.name}`);
        } catch (e) { console.error(`❌ ${data.name} تعثر:`, e.message); }
    });

    await client.login(data.token);
}

// التشغيل المتتابع مع عزل كل بوت في "لحظة زمنية" منفصلة
async function startAll() {
    for (const bot of botsData) {
        if (bot.token) {
            console.log(`🚀 جاري تشغيل ${bot.name}...`);
            boot(bot);
            // تأخير 20 ثانية بين كل بوت لضمان عدم تداخل الـ Gateway Connection
            await new Promise(r => setTimeout(r, 20000));
        }
    }
}

startAll();
