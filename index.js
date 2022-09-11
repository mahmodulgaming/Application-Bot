const { Client } = require("discord.js");
const data = require('./data/config')
const loginNotification = data.owenerID
const client = new Client({
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
});
 
// BOT IS NOW ONLINE
client.on('ready', async(members) => {
    
     // ready message
     console.log('📝 | Starting your application bot. Please wait')
    const P = ['Loading',  'Loading.', 'Loading..', 'Loading...'];
let x = 0;
const loader = setInterval(() => {
  process.stdout.write(`\r${P[x++]}`);
  x %= P.length;
}, 250);
console.log('--------------------------------------------------')
setTimeout(() => {
  clearInterval(loader, console.log('Done'));
}, 5000)
setTimeout(() => {
    clearInterval(console.log('--------------------------------------------------'), console.log('✅ | Your Application bot is ready!'));
  }, 5000)


    // BOT ACTIVITY
    client.user.setPresence({
        activities: [{ 
          name: "Your applications", // type anything
          type: "WATCHING" // you can also change this example - PLAYING, STREAMING, LISTENING
        }],
        status: "online" // you can also change this example - online, idle, dnd
    })
    // BOT ACTIVITY END

    // SLASH COMMAND
    let guild = client.guilds.cache.get(data.guildId)
    if(guild) {
        await guild.commands.set([
            {
                name: "ping",
                description: 'sends bot ping'
            },
            {
                name: "help",
                description: 'send help message'
            },
            {
                name: "setup",
                description: 'setup application your channel'
            }
        ])
    }
    require('./data/forms/form') (client, data)

})

client.login(data.token)
