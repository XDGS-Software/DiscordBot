import { Message } from "discord.js";

module.exports = {
    name: "tos",
    description: "get a link to our T.O.S",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'tosCommandCooldown', null, null, async () => {
            await message.reply('Our T.O.S: https://xdgs.gstudiosx.tk/tos');
        });
    }
}