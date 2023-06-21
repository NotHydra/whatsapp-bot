// const { databaseClient } = require("./database");

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

        this.credit = async (message) => {
            await message.reply("Credit: https://www.instagram.com/rz_irswanda/");
        };

        this.help = async (message) => {
            // databaseClient.query("SELECT * FROM command ORDER BY id ASC;", async (err, res) => {
            //     await message.reply(
            //         res.rows
            //             .map((commandObject) => {
            //                 return `${commandObject.command}: ${commandObject.description}`;
            //             })
            //             .join("\n\n")
            //     );
            // });

            const helpText = ["!itk <command>"];

            dependency.commandArray.forEach((commandObject) => {
                helpText.push(`${commandObject.command}: ${commandObject.description}`);
            });

            await message.reply(helpText.join("\n\n"));
        };

        this.test = async (message, chat, client) => {
            await this.everyone(message, chat, client);
            await this.credit(message);
            await this.help(message);
        };
    }
}

module.exports = { Command };
