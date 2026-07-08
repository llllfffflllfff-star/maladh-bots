const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// سيرفر للبقاء نشطاً
http.createServer((req, res) => { res.writeHead(200); res.end('Alive'); }).listen(process.env.PORT || 8080);

const bots = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

async function startBot(config) {
    if (!config.token) return;
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
    
    client.on('ready', async () => {
        console.log(`✅ ${config.name} متصل!`);
        try {
            const channel = await client.channels.fetch(config.channelId);
            if (channel) {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                console.log(`🔊 ${config.name} دخل الروم: ${channel.name}`);
            }
        } catch (e) { console.error(`❌ خطأ ${config.name}:`, e.message); }
    });
    client.login(config.token);
}

// تشغيل البوتات بفارق زمني بسيط
bots.forEach((bot, i) => setTimeout(() => startBot(bot), i * 15000));
