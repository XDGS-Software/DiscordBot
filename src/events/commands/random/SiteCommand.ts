import { Message } from "discord.js";

module.exports = {
    name: "site",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'siteCommandCooldown', null, null, async () => {
            await message.reply('Our Site: https://xdgs.gstudiosx.tk/');
        });
    }
}