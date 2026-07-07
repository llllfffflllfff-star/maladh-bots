const http = require('http');
const { spawn } = require('child_process');

// Keep-alive HTTP server for UptimeRobot pinging
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bots are alive.');
}).listen(8080, () => console.log('Keep-alive server running on port 8080'));


const bots = [
    { label: 'Bot 1', token: 'MTUyMjEyMTc4Mjk5ODMzNTU2OA.GlXtqw.xO8mTM5uUpSjmud92rwc91jV4xjuUMqNGPoEmU', guildId: '1505700340392263720', channelId: '1505724955143442605' },
    { label: 'Bot 2', token: 'MTUyMjExMzE5NzE0MDczODExOQ.Gk_rx4.x7H-pt-VgOvemYK4X1c5D0g1yATxzaevayOYmg', guildId: '1505700340392263720', channelId: '1515803830955151502' },
    { label: 'Bot 3', token: 'MTUyMjExNTQ5MzYyMjk3MjU3Ng.GI2s_o.yZBqSL6q-3FAIg8K1kz0dLz14-YiFk2I3ZiL-M', guildId: '1505700340392263720', channelId: '1515803958344417310' },
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
