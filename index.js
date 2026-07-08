const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

http.createServer((req, res) => res.end('Alive')).listen(process.env.PORT || 8080);

const bots = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' },
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

async function startBot(bot) {
    // كل بوت يمتلك "Client" خاص به تماماً
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

    client.once('ready', async () => {
        console.log(`✅ ${bot.name} دخل السيرفر.`);
        try {
            const channel = await client.channels.fetch(bot.channelId);
            if (channel) {
                // اتصال مباشر بدون تعقيدات إعادة الاتصال
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                console.log(`🔊 ${bot.name} ثبت في الروم.`);
            }
        } catch (err) {
            console.log(`❌ ${bot.name} واجه مشكلة: ${err.message}`);
        }
    });

    await client.login(bot.token);
}

// تشغيل البوتات بفارق زمني طويل جداً (40 ثانية)
// هذا يضمن أن ديسكورد أنهى "جلسة" البوت الأول قبل أن يبدأ الثاني
async function run() {
    for (const bot of bots) {
        if (bot.token) {
            console.log(`⏳ جاري بدء ${bot.name}...`);
            startBot(bot);
            await new Promise(resolve => setTimeout(resolve, 40000));
        }
    }
}

run();
