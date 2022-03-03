import { Message } from "discord.js";

let fs = require('fs');
let { prefix, command_cooldown, command_cooldown_reaction } = process.env;

let cooldown = [];
async function cooldownIt(message: Message, name: string, ms: number, reaction: string, callback: Function) {
	if((cooldown[`${message.author.id}-${name}`]||null)==null){
		callback();
		setTimeout(()=>{
			cooldown[`${message.author.id}-${name}`]=null;
			cooldown=cooldown.filter((value)=>{return value != null;});
		},(ms||Number(command_cooldown)));
		cooldown[`${message.author.id}-${name}`]=true;
	}else{await message.react(reaction||command_cooldown_reaction);}
}

let commands = [
	{
		name: "site",
		async execute(message: Message, args: string[]) {
			await cooldownIt(message, 'siteCommandCooldown', null, null, async () => {
				await message.reply('Our Site: https://xdgs.gstudiosx.tk/');
			});
		}
	},
	{
		name: "tos",
		async execute(message: Message, args: string[]) {
			await cooldownIt(message, 'tosCommandCooldown', null, null, async () => {
				await message.reply('Our T.O.S: https://xdgs.gstudiosx.tk/tos');
			});
		}
	},
	{
		name: "privacy",
		async execute(message: Message, args: string[]) {
			await cooldownIt(message, 'privacyCommandCooldown', null, null, async () => {
				await message.reply('Our Privacy Policy: https://xdgs.gstudiosx.tk/privacy');
			});
		}
	},
	{
		name: "help",
		async execute(message: Message, args: string[]) {
			await message.reply("Help:\n" + 
			commands.map((value) => { return value.name; })
			.filter((value) => {
				return args.length == 0 || (args.length > 0 && value.includes(args[0]));
			}).join('\n'));
		}
	},
];

if (fs.existsSync(__dirname + '/commands')) {
	const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
	for (const file of commandFiles) {
		const command = require(__dirname + `/commands/${file}`);
		commands.push(command);
	}
}

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(prefix)) return;

		let args = message.content.split(" ");
		let command = args.shift().replace(prefix, "");

		let cmds = commands.filter((value) => { return value.name == command; });

		if (cmds.length > 0) {
			await cmds[0].execute(message, args);
		}
	},
};