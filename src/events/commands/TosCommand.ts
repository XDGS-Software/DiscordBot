import { Message } from "discord.js";

module.exports = {
    name: "tos",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'tosCommandCooldown', null, null, async () => {
            await message.reply('Our T.O.S: https://xdgs.gstudiosx.tk/tos');
        });
    }
}