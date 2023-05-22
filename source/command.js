const { Dependency } = require("./dependency");

const dependency = new Dependency();

class Command {
    constructor() {
        this.everyone = async (message, chat, client) => {
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

        this.hi = async (message) => {
            await message.reply("Hello!")
        };

        this.hello = async (message) => {
            await message.reply("Hi!")
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
            await this.hi(message);
            await this.hello(message);
            await this.credit(message);
            await this.help(message);
        };
    }
}

module.exports = { Command }