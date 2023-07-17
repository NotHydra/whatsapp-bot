import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { includeKey, latestModelId } from "../../../utility";

import { GroupInterface } from "../../../common/interface/model/group";
import { GroupMessageInterface } from "../../../common/interface/model/group-message";

import { GroupMessageModel, GroupModel } from "../../../model";

export const groupMessageShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    const groupMessageArray: Array<HydratedDocument<GroupMessageInterface>> = await GroupMessageModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();
    if (groupMessageArray.length >= 1) {
        const textArray: Array<string> = groupMessageArray.map((groupMessageObject: HydratedDocument<GroupMessageInterface>, groupMessageIndex: number): string => {
            return `${groupMessageIndex + 1}. ${groupMessageObject.text}`;
        });

        await message.reply(textArray.join("\n\n"));
    } else {
        await message.reply("No Message Available");
    }
};

export const groupMessageAdd = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 4);
        const argumentMessage: string = splittedMessage.join(" ");
        const groupMessageArray: Array<HydratedDocument<GroupMessageInterface>> = await GroupMessageModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();
        if (!includeKey(groupMessageArray, "text", argumentMessage)) {
            await GroupMessageModel.create({
                _id: await latestModelId(GroupMessageModel),
                id_group: groupObject._id,
                text: argumentMessage,
            });

            await message.reply("Message Added");
        } else {
            await message.reply("Message Already Used");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupMessageRemove = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 4);
        const argumentMessage: string = splittedMessage.join(" ");
        const groupMessageArray: Array<HydratedDocument<GroupMessageInterface>> = await GroupMessageModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();
        if (includeKey(groupMessageArray, "text", argumentMessage)) {
            await GroupMessageModel.deleteOne({ id_group: groupObject._id, text: argumentMessage });

            await message.reply("Message Removed");
        } else {
            await message.reply("Message Doesn't Exist");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
