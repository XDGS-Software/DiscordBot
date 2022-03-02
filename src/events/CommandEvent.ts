import { Message } from "discord.js";

let { prefix } = process.env;

let cooldown = {};
async function cooldownIt(message: Message, name: string, ms: number, reaction: string, callback: Function) {
	if((cooldown[`${message.author.id}-${name}`]||null)==null){
		callback();
		setTimeout(()=>{cooldown[`${message.author.id}-${name}`]=null;},ms);
		cooldown[`${message.author.id}-${name}`]=true;
	}else{await message.react(reaction);}
}

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
				await cooldownIt(message, 'siteCommandCooldown', 3500, '⌛', async () => {
					await message.reply('Our Site: https://xdgs.gstudiosx.tk/');
				});
				break;
			case "tos":
				await cooldownIt(message, 'tosCommandCooldown', 3500, '⌛', async () => {
					await message.reply('Our T.O.S: https://xdgs.gstudiosx.tk/tos');
				});
				break;
			case "privacy":
				await cooldownIt(message, 'privacyCommandCooldown', 3500, '⌛', async () => {
					await message.reply('Our Privacy Policy: https://xdgs.gstudiosx.tk/privacy');
				});
				break;
		}
	},
};