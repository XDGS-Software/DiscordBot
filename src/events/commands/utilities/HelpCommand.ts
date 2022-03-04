import { HexColorString, Message, MessageEmbed } from "discord.js";

let { prefix, embed_color } = process.env;

function toHexColorString(hex: string) : HexColorString {
    return `#${hex.replace("#", "")}`;
}

let CommandEvent = require('../../CommandEvent');

module.exports = {
    name: "help",
    description: "a command that shows a list of commands",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        let commandNames = CommandEvent.commands.map((value) => { 
            return prefix + value.name
            .replaceAll("(", "")
            .replaceAll(")", "") + (
                value.arguments != undefined && value.arguments.length && 
                value.arguments.length > 0 ?
                " " + value.arguments.join(" ") : ""
            ); 
        }).filter((value) => { return args.length == 0 || 
            (args.length > 0 && value.includes(args[0])); });

        let embed = new MessageEmbed()
            .setFooter({ 
                text: `Requested by ${message.author.tag}`, 
                iconURL: message.author.avatarURL() 
            })
            .setColor(toHexColorString(embed_color))
            .setTitle("Help Menu");
            
        for (let i = 0; i < commandNames.length; i++) {
            const v = commandNames[i];
            const vv = v.split(" ")[0].replace(prefix, "");
            const c = CommandEvent.commands.filter((value) => value.name.includes(vv))[0];
            const hidden = c.hideInHelp || false;
            if (!hidden) 
                embed.addField(v, c.description || "Description", true);
        }
        
        await message.reply({ embeds: [ embed ] });
    }
}