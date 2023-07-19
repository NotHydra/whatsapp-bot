import { Client, Contact, GroupParticipant, Message } from "whatsapp-web.js";

import { commandArray, socialArray } from "../../depedency";

import { CommandInterface } from "../../common/interface/command";
import { ChatExtended } from "../../common/interface/chat";
import { SocialInterface } from "../../common/interface/social";

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

    if (!message.hasQuotedMsg) {
        await message.reply(textArray.join("\n"), undefined, { mentions: mentionArray });
    } else {
        const quotedMessage = await message.getQuotedMessage();

        await quotedMessage.reply(textArray.join("\n"), undefined, { mentions: mentionArray });
    }
};

export const generalCredit = async (message: Message): Promise<void> => {
    await message.reply(
        socialArray
            .map((socialObject: SocialInterface) => {
                return `${socialObject.title}: ${socialObject.link}`;
            })
            .join("\n\n")
    );
};

export const generalHelp = async (message: Message): Promise<void> => {
    await message.reply(
        `!<prefix> <command>\n\n${commandArray
            .map((commandObject: CommandInterface): string => {
                return `${commandObject.command}: ${commandObject.description}`;
            })
            .join("\n\n")}`
    );
};

export const generalTest = async (message: Message, client: Client): Promise<void> => {
    await generalEveryone(message, client);
    await generalCredit(message);
    await generalHelp(message);
};
