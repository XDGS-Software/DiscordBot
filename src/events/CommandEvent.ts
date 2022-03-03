import { Message } from "discord.js";

let fs = require('fs');
let { prefix, command_cooldown, command_cooldown_reaction } = process.env;

let cooldown = [];
async function cooldownIt(message: Message, name: string, ms: number, reaction: string, callback: Function) {
	let id = `${message.guild.id}-${message.author.id}-${name}`;
	if((cooldown[id]||null)==null){
		callback();
		setTimeout(()=>{
			cooldown[id]=null;
			cooldown=cooldown.filter((value)=>{return value != null;});
		},(ms||Number(command_cooldown)));
		cooldown[id]=true;
	}else{await message.react(reaction||command_cooldown_reaction);}
}

let commands = [
	{
		name: "help",
		async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
			await message.reply("Help:\n" + 
			commands.map((value) => { return value.name; })
			.filter((value) => {
				return args.length == 0 || (args.length > 0 && value.includes(args[0]));
			}).join('\n'));
		}
	},
];

function loadCommands(dir) {
	if (fs.existsSync(__dirname + dir)) {
		const commandFiles = fs.readdirSync(__dirname + dir).filter(file => file.endsWith('.js') 
		|| file.endsWith('.ts') || fs.statSync(__dirname + dir + "/" + file).isDirectory());
		for (const file of commandFiles) {
			let stat = fs.statSync(__dirname + `${dir}/${file}`);
			if (stat.isDirectory()) {
				loadCommands(`${dir}/${file}/`);
			} else {
				const command = require(__dirname + `${dir}/${file}`);
				commands.push(command);
			}
		}
	}
}

loadCommands('/commands');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(prefix)) return;

		let args = message.content.split(" ");
		let command = args.shift().replace(prefix, "");

		let cmds = commands.filter((value) => { return value.name.match(command); });

		if (cmds.length > 0) {
			await cmds[0].execute(message, command, args, cooldownIt);
		}
	},
};