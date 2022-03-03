import { Client, ClientPresenceStatus, Intents } from "discord.js";

require('dotenv').config();

let fs = require('fs');
let { token, status, status_activity, status_activity_type } = process.env;

let bot: Client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

function toPresenceStatus(status: string) : ClientPresenceStatus {
    return status == 'online' ? 
        'online' : status == 'dnd' ?
        'dnd' : status == 'idle' ?
        'idle' : null;
}

bot.once('ready', (client) => {
    console.log(`Logged into '${client.user.tag}'.`);

    bot.user.setPresence({
        status: toPresenceStatus(status),
        activities: [
            {
                name: status_activity,
                type: status_activity_type 
                
                // idk what to do about this error it seems to work when its compiled to js 
                // but it erorrs in ts? 
                // i guess it aint much of a problem rn
            }
        ]
    });
});

const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
	const event = require(__dirname + `/events/${file}`);
	if (event.once) {
		bot.once(event.name, async (...args) => await event.execute(...args));
	} else {
		bot.on(event.name, async (...args) => await event.execute(...args));
	}
}

bot.login(token);