import { Message } from "discord.js";

let { prefix } = process.env;

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(prefix)) return;

		let args = message.content.split(" ");
		let command = args.shift().replace(prefix, "");

		switch (command) {
			case "test":
        		await message.reply('This is a test command.');
				break;
			case "site":
				await message.reply('Our Site: https://xdgs.gstudiosx.tk/');
				break;
		}
	},
};