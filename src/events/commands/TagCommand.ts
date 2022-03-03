import { HexColorString, Message, MessageEmbed, Permissions } from "discord.js";

export const Tag = {name:"", description:""};

let tags: typeof Tag[] = [];
let { prefix, embed_color } = process.env;

function toHexColorString(hex: string) : HexColorString {
    return `#${hex.replace("#", "")}`;
}

const Enmap = require('enmap');
const DB = new Enmap({
    name: "db", 
    fetchAll: false
});

let t = DB.get('tags');
if (t !== undefined) {
    tags = t;
}

module.exports = {
    name: "(tag|tags)",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        switch (command) {
            case "tag":
                if (args.length > 0) {
                    if (args[0] == "refresh") {
                        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

                        let t = DB.get('tags');
                        if (t !== undefined) {
                            tags = t;
                        }

                        await message.reply(`refreshed tags from db`);
                        break;
                    } else if (args[0] == "delete") {
                        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
                        if (args.length >= 2) {
                            let tagName = args[1];

                            if (tags.findIndex((value) => value.name === tagName) == -1) {
                                await message.reply(`A tag with that name doesn't exist`);
                                break;
                            }

                            tags = tags.filter((value) => value.name !== tagName);
                            await DB.set('tags', tags);

                            await message.reply(`Tag ${tagName} deleted`);
                            break;
                        } else {
                            await message.reply(`${prefix}tag delete <tag>`);
                            break;
                        }
                    } else if (args[0] == "create") {
                        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
                        if (args.length >= 3) {
                            let tagName = args[1];
                            let tagDescription = args.splice(2).join(' ')
                                .replaceAll("\\n", "\n")
                                .replaceAll("```", "");

                            if (tags.findIndex((value) => value.name === tagName) != -1) {
                                await message.reply(`A tag with that name already exists`);
                                break;
                            }

                            if (tagDescription.length > 0 && 
                                tagDescription !== '' && 
                                tagDescription !== ' ') {
                                if (tagName.length > 0 && 
                                    tagName !== '' && 
                                    tagName !== ' ') {

                                    let newTag: typeof Tag = {name:"", description:""};
                                    newTag.name = tagName;
                                    newTag.description = tagDescription;
                                    tags.push(newTag);

                                    if (await DB.get('tags') == undefined) {
                                        DB.set('tags', tags);
                                    } else {
                                        await DB.set('tags', tags);
                                    }

                                    await message.reply(`Tag created with name ${newTag.name}`);
                                    break;
                                } else {
                                    await message.reply(`Invalid tag name`);
                                    break;
                                }
                            } else {
                                await message.reply(`Invalid tag description`);
                                break;
                            }
                        } else {
                            await message.reply(`${prefix}tag create <tag> <description>`);
                            break;
                        }
                    } else {
                        let tagL: typeof Tag[] = tags.filter((value) => value.name == args[0]);
                        if (tagL.length > 0) {
                            let tag: typeof Tag = tagL[0];
                            let embed = new MessageEmbed()
                                .setFooter({ 
                                    text: `Requested by ${message.author.tag}`, 
                                    iconURL: message.author.avatarURL() 
                                })
                                .setColor(toHexColorString(embed_color))
                                .setTitle(tag.name)
                                .setDescription(tag.description);
                            await message.reply({ embeds: [ embed ] });
                            break;
                        }
                    }
                } else {
                    await message.reply(`${prefix}tag (${
                        tags.map((value) => "**"+value.name+"**").join("|")}${
                            message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ?
                            (tags.length > 0 ? "|" : "") + "create <tag> <description>|delete <tag>|refresh" : ""})`);
                    break;
                }
                break;
            case "tags":
                await message.reply("tags: " + tags.filter((value) => args.length == 0 || 
                (args.length > 0 && value.name.includes(args[0]))).map((value) => value.name).join(', '));
                break;
            default:
                break;
        }
    }
}