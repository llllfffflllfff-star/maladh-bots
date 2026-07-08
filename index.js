const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// سيرفر للحفاظ على بقاء البوت (Keep-alive)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, guildId: '1505700340392263720', channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, guildId: '1505700340392263720', channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, guildId: '1505700340392263720', channelId: '1515803958344417310' }
];

function startBot(config) {
    if (!config.token) return console.log(`خطأ: التوكن غير موجود لـ ${config.name}`);

    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.once('ready', () => {
        console.log(`تم تشغيل ${config.name} بنجاح!`);
        
        const channel = client.channels.cache.get(config.channelId);
        if (channel) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            console.log(`${config.name} دخل الروم!`);
        }
    });

    client.login(config.token);
}

botsConfig.forEach(startBot);
