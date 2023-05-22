import { Dependency } from "./dependency.js";

const dependency = new Dependency();

export class Command {
    constructor() {
        this.everyone = async (message, chat, client) => {
            let text = "";
            let mentionArray = [];

            for (let participantObject of chat.participants) {
                const contact = await client.getContactById(participantObject.id._serialized);

                mentionArray.push(contact);
                text += `@${participantObject.id.user} `;
            }

            await message.reply(text, undefined, { mentions: mentionArray });
        };

        this.credit = async (message) => {
            await message.reply("Credit: https://www.instagram.com/rz_irswanda/");
        };

        this.help = async (message) => {
            await message.reply(
                dependency.commandArray
                    .map((commandObject) => {
                        return `${commandObject.command}: ${commandObject.description}`;
                    })
                    .join("\n")
            );
        };

        this.test = async (message, chat, client) => {
            await this.everyone(message, chat, client);
            await this.credit(message);
            await this.help(message);
        };
    }
}
