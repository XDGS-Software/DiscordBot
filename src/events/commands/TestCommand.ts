import { Message } from "discord.js";

module.exports = {
    name: "test",
    async execute(message: Message, args: string[]) {
        await message.reply('This is a test command.');
    }
}