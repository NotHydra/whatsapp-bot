import { Chat, Client, Contact, GroupParticipant, Message } from "whatsapp-web.js";

import { commandArray } from "../../depedency";

import { CommandInterface } from "../../common/interface/command";

export const generalEveryone = async (message: Message, client: Client): Promise<void> => {
    const chat: Chat | any = await message.getChat();

    const textArray: Array<string> = [];
    const mentionArray: Array<Contact> = await Promise.all(
        await chat.participants.map(async (participantObject: GroupParticipant, participantIndex: number) => {
            const contact: Contact = await client.getContactById(participantObject.id._serialized);

            textArray.push(`${participantIndex + 1}. @${participantObject.id.user}`);
            return contact;
        })
    );

    await message.reply(textArray.join("\n"), undefined, { mentions: mentionArray });
};

export const generalCredit = async (message: Message): Promise<void> => {
    await message.reply("Credit: https://www.instagram.com/rz_irswanda/");
};

export const generalHelp = async (message: Message): Promise<void> => {
    const helpText: Array<string> = ["!<prefix> <command>"];

    commandArray.forEach((commandObject: CommandInterface) => {
        helpText.push(`${commandObject.command}: ${commandObject.description}`);
    });

    await message.reply(helpText.join("\n\n"));
};

export const generalTest = async (message: Message, client: Client): Promise<void> => {
    await generalEveryone(message, client);
    await generalCredit(message);
    await generalHelp(message);
};
