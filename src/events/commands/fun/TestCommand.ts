import { Message } from "discord.js";

module.exports = {
    name: "test",
    description: "a test command",
    hideInHelp: true,
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        await cooldownIt(message, 'testCommandCooldown', null, null, async () => {
            await message.reply('This is a test command.');
        });
    }
}