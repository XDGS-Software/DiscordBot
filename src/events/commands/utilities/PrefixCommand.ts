import { Message, Permissions } from "discord.js";

let { prefix, embed_color } = process.env;
const DB = require('../../CommandEvent').DB;

module.exports = {
    name: "prefix",
    description: "change the prefix with this simple command",
    hideInHelp: false,
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        prefix = DB.get(`${message.guild.id}-prefix`) || process.env['prefix'];

        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (args.length > 0) {
                if (args[0] === 'set') {
                    if (args[1] != '' || args[1] != undefined || args[1] != null) {
                        DB.set(`${message.guild.id}-prefix`, args[1]);
                        await message.reply(`prefix set to: "${args[1]}"`);
                    } else {
                        await message.reply(`couldn't set prefix to: "${args[1]}"`);
                    }
                    return; 
                } else {
                    await message.reply(`${prefix}prefix (set <newPrefix>|get)`);
                    return;
                }
            }

            await cooldownIt(message, 'prefixCommandCooldown', null, null, async () => {
                await message.reply(`Your command prefix: "${prefix}".`);
            });
        } else {
            await message.reply("you need administrator to run this command");
        }
    }
}