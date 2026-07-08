const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// هنا ايدي السيرفر اللي عطيتني اياه
const SERVER_ID = '1505700340392263720';

// مصفوفة البوتات مع أيديات الرومات المحددة لكل واحد
const botsConfig = [
    { name: 'Bot 1', token: process.env.TOKEN1, channelId: '1505724955143442605' }, 
    { name: 'Bot 2', token: process.env.TOKEN2, channelId: '1515803830955151502' },
    { name: 'Bot 3', token: process.env.TOKEN3, channelId: '1515803958344417310' }
];

async function startBot(config) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    client.on('ready', async () => {
        console.log(`✅ ${config.name} اتصل بالسيرفر.`);
        
        try {
            const guild = await client.guilds.fetch(SERVER_ID);
            const channel = await guild.channels.fetch(config.channelId);

            if (channel) {
                // الاتصال المستقل لكل بوت
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                console.log(`🔊 ${config.name} دخل الروم: ${channel.name} ولن يخرج.`);
            }
        } catch (err) {
            console.log(`❌ خطأ في ${config.name}: تأكد أن البوت داخل السيرفر.`);
        }
    });

    client.login(config.token);
}

// تشغيل البوتات بفارق زمني (5 ثواني) لضمان عدم حدوث تضارب في الاتصال
async function runAll() {
    for (const config of botsConfig) {
        if (config.token) {
            startBot(config);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

runAll();
