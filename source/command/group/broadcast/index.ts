import { Client, Contact, GroupParticipant, Message } from "whatsapp-web.js";
import { ChatExtended } from "../../../common/interface/chat";

export const groupBroadcast = async (client: Client, message: Message, splittedMessage: Array<string>): Promise<void> => {
    splittedMessage.splice(0, 3);
    const argumentMessage: string = splittedMessage.join(" ");
    const contact: Contact = await message.getContact();
    const chat: ChatExtended = await message.getChat();

    const sender: string = contact.pushname;
    const groupName: string = chat.groupMetadata.subject;
    const newMessage: string = `*Siaran Dari ${sender} (${groupName})*\n\n${argumentMessage}`;

    chat.participants.map(async (participantObject: GroupParticipant): Promise<void> => {
        await client.sendMessage(participantObject.id._serialized, newMessage);
    });
};
