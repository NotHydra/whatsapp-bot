const { Dependency } = require("./dependency");

const dependency = new Dependency();

class Command {
    constructor() {
        this.everyone = async (message, client) => {
            const chat = await message.getChat();

            let textArray = [];
            let mentionArray = await Promise.all(
                await chat.participants.map(async (participantObject, participantIndex) => {
                    const contact = await client.getContactById(participantObject.id._serialized);

                    textArray.push(`${participantIndex + 1}. @${participantObject.id.user}`);
                    return contact;
                })
            );

            await message.reply(textArray.join("\n"), undefined, { mentions: mentionArray });
        };

        this.credit = async (message) => {
            await message.reply("Credit: https://www.instagram.com/rz_irswanda/");
        };

        this.help = async (message) => {
            const helpText = ["!<prefix> <command>"];

            dependency.commandArray.forEach((commandObject) => {
                helpText.push(`${commandObject.command}: ${commandObject.description}`);
            });

            await message.reply(helpText.join("\n\n"));
        };

        this.test = async (message, client) => {
            await this.everyone(message, client);
            await this.credit(message);
            await this.help(message);
        };
    }
}

module.exports = { Command };
