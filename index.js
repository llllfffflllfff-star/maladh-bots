const http = require('http');
const { spawn } = require('child_process');

// Keep-alive HTTP server for UptimeRobot pinging
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bots are alive.');
}).listen(8080, () => console.log('Keep-alive server running on port 8080'));


const bots = [
    { label: 'Bot 1', token: process.env.TOKEN1, guildId: '1505700340392263720', channelId: '1505724955143442605' },
    { label: 'Bot 2', token: process.env.TOKEN2, guildId: '1505700340392263720', channelId: '1515803830955151502' },
    { label: 'Bot 3', token: process.env.TOKEN3, guildId: '1505700340392263720', channelId: '1515803958344417310' },
];

function spawnBot(bot, delayMs) {
    setTimeout(() => {
        const child = spawn('node', ['bot-worker.js'], {
            env: {
                ...process.env,
                BOT_TOKEN:      bot.token,
                BOT_GUILD_ID:   bot.guildId,
                BOT_CHANNEL_ID: bot.channelId,
                BOT_LABEL:      bot.label,
            },
            stdio: 'inherit', // pipe child stdout/stderr to this process
        });

        child.on('exit', (code) => {
            console.log(`${bot.label} process exited (code ${code}) — restarting in 10s...`);
            spawnBot(bot, 10000);
        });
    }, delayMs);
}

// Stagger each bot by 30 seconds to avoid Discord rate limits
bots.forEach((bot, i) => spawnBot(bot, i * 30000));
