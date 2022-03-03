import { Message } from "discord.js";

module.exports = {
    name: "test",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'testCommandCooldown', null, null, async () => {
            await message.reply('This is a test command.');
        });
    }
}