import { HexColorString, Message, MessageEmbed } from "discord.js";

export const Tag = {name:"", description:""};

let tags: typeof Tag[] = [];
let { prefix, embed_color } = process.env;

function toHexColorString(hex: string) : HexColorString {
    return `#${hex.replace("#", "")}`;
}

module.exports = {
    name: "(tag|tags)",
    async execute(message: Message, command: string, args: string[], cooldownIt: Function) {
        switch (command) {
            case "tag":
                if (args.length > 0) {
                    if (args[0] == "delete") {
                        // TODO: make delete
                    } else if (args[0] == "create") {
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
                                .setColor(toHexColorString(embed_color))
                                .setTitle(tag.name)
                                .setDescription(tag.description);
                            await message.reply({ embeds: [ embed ] });
                            break;
                        }
                    }
                } else {
                    await message.reply(`${prefix}tag (${
                        tags.map((value) => value.name).join("|")}${
                            tags.length > 0 ? "|" : ""}create <tag> <description>|delete <tag>)`);
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