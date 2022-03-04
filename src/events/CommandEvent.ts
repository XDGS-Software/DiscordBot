import { Client, Message } from "discord.js";

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

const Enmap = require('enmap');
const DB = new Enmap({
    name: "db", 
    fetchAll: false
});

const client: Client = require('./../index').bot;

module.exports = {
	commands: [],
	name: 'messageCreate',
	once: false,
	DB,
	async execute(message: Message) {
		if (message.author.bot) return;
		
		let prefixNew = module.exports.DB.get(`${message.guild.id}-prefix`) || prefix;

		if (!message.content.startsWith(prefixNew) && !message.mentions.has(client.user)) return;

		let args = message.content.split(" ");
		if (message.mentions.has(client.user)) args = args.splice(1);
		let command = args.shift().replace(prefixNew, "");

		let cmds = module.exports.commands.filter((value) => { return value.name.match(command); });

		if (cmds.length > 0) {
			await cmds[0].execute(message, command, args, cooldownIt);
		}
	},
};

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
				if (command.parent == null || 
					command.parent == undefined) command.parent = dir;
				module.exports.commands.push(command);
			}
		}
	}
}

loadCommands('/commands');