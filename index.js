const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('System Online');
}).listen(process.env.PORT || 8080);

// تم تحديد الأيدي بدقة لكل بوت
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
        console.log(`✅ ${config.name} جاهز.`);
        
        const channel = await client.channels.fetch(config.channelId).catch(() => null);
        if (!channel) return;

        // دالة "القفل" - تضمن أن البوت لا يخرج من الروم المخصص له
        const connect = () => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });

            // إذا حاول البوت تغيير الروم أو فصل، يعيد الاتصال فوراً بنفس الروم
            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                connection.destroy();
                connect();
            });
            
            console.log(`🔊 ${config.name} تم تثبيته في: ${channel.name}`);
        };

        connect();
    });

    client.login(config.token);
}

// تشغيل البوتات بفاصل زمني كبير (10 ثواني) لضمان عدم تداخل الاتصالات
async function runBots() {
    for (const config of botsConfig) {
        if (config.token) {
            console.log(`⏳ جاري تشغيل ${config.name} بعد 10 ثواني...`);
            await new Promise(resolve => setTimeout(resolve, 10000)); 
            startBot(config);
        }
    }
}

runBots();
