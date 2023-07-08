import { Client, Contact, GroupParticipant, Message } from "whatsapp-web.js";

import { commandArray } from "../../depedency";

import { CommandInterface } from "../../common/interface/command";
import { ChatExtended } from "../../common/interface/chat";

export const generalEveryone = async (message: Message, client: Client): Promise<void> => {
    const chat: ChatExtended = await message.getChat();

    const textArray: Array<string> = [];
    const mentionArray: Array<Contact> = await Promise.all(
        chat.participants.map(async (participantObject: GroupParticipant, participantIndex: number): Promise<Contact> => {
            const contact: Contact = await client.getContactById(participantObject.id._serialized);

            textArray.push(`${participantIndex + 1}. @${participantObject.id.user}`);
            return contact;
        })
    );

    await message.reply(textArray.join("\n"), undefined, { mentions: mentionArray });
};

export const generalCredit = async (message: Message): Promise<void> => {
    await message.reply(
        "Website: irswanda.com\n\nInstagram: instagram.com/rz_irswanda\n\nLinkedIn: www.linkedin.com/in/rizky-irswanda-b068b6216\n\nEmail: rizky.irswanda115@gmail.com"
    );
};

export const generalHelp = async (message: Message): Promise<void> => {
    const helpText: Array<string> = ["!<prefix> <command>"];

    commandArray.forEach((commandObject: CommandInterface): void => {
        helpText.push(`${commandObject.command}: ${commandObject.description}`);
    });

    await message.reply(helpText.join("\n\n"));
};

export const generalTest = async (message: Message, client: Client): Promise<void> => {
    await generalEveryone(message, client);
    await generalCredit(message);
    await generalHelp(message);
};
