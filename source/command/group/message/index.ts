import { Message } from "whatsapp-web.js";

import { HydratedDocument } from "mongoose";

import { GroupInterface } from "../../../common/interface/group";

import { GroupModel } from "../../../model";

export const groupMessageShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();
    if (groupObject.message.length != 0) {
        const textArray: Array<string> = groupObject.message.map((messageObject: string, messageIndex: number): string => {
            return `${messageIndex + 1}. ${messageObject}`;
        });

        await message.reply(textArray.join("\n\n"));
    } else {
        await message.reply("No Message Available");
    }
};

export const groupMessageAdd = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 4);
        const groupMessage: string = splittedMessage.join(" ");
        if (!groupObject.message.includes(groupMessage)) {
            groupObject.message.push(groupMessage);
            await GroupModel.updateOne(
                { remote: message.from },
                {
                    message: groupObject.message,
                }
            ).lean();

            await message.reply("Message Added");
        } else {
            await message.reply("Message Already Used");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupMessageRemove = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 4);
        const groupMessage: string = splittedMessage.join(" ");
        if (groupObject.message.includes(groupMessage)) {
            const messageIndex: number = groupObject.message.indexOf(groupMessage);
            if (messageIndex != -1) {
                groupObject.message.splice(messageIndex, 1);
                await GroupModel.updateOne(
                    { remote: message.from },
                    {
                        message: groupObject.message,
                    }
                ).lean();

                await message.reply("Message Removed");
            } else {
                await message.reply("Message Failed To Be Removed");
            }
        } else {
            await message.reply("Message Doesn't Exist");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
