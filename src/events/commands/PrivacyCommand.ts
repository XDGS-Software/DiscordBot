import { Message } from "discord.js";

module.exports = {
    name: "privacy",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'privacyCommandCooldown', null, null, async () => {
            await message.reply('Our Privacy Policy: https://xdgs.gstudiosx.tk/privacy');
        });
    }
}