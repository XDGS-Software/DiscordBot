import { Message } from "discord.js";

let { prefix } = process.env;

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(prefix)) return;

		let args = message.content.split(" ");
		let command = args.shift().replace(prefix, "");

		switch (command) {
			case "test":
        		message.reply('Hello, World!');
				break;
		}
	},
};