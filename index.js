const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const SERVER_ID = '1505700340392263720';

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
        console.log(`✅ ${config.name} سجل دخول!`);
        
        try {
            const guild = await client.guilds.fetch(SERVER_ID);
            console.log(`🔎 ${config.name} يبحث عن الروم: ${config.channelId}`);
            
            const channel = await guild.channels.fetch(config.channelId);
            
            if (channel) {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                console.log(`🔊 ${config.name} دخل الروم بنجاح: ${channel.name}`);
            } else {
                console.log(`❌ ${config.name} لم يجد الروم! تأكد من الأيدي.`);
            }
        } catch (err) {
            console.log(`❌ ${config.name} فشل في الدخول: ${err.message}`);
        }
    });

    client.on('error', (err) => console.log(`⚠️ خطأ في ${config.name}: ${err.message}`));

    client.login(config.token).catch(e => console.log(`❌ ${config.name} فشل تسجيل الدخول بالتوكن!`));
}

// تشغيل البوتات
botsConfig.forEach((config, index) => {
    setTimeout(() => {
        if (config.token) {
            startBot(config);
        } else {
            console.log(`⚠️ ${config.name} ليس له توكن.`);
        }
    }, index * 5000);
});
