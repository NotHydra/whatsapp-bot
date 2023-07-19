import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { includeKey, latestModelId } from "../../../../utility";

import { GroupInterface } from "../../../../common/interface/model/group";
import { GroupMessagePublicInterface } from "../../../../common/interface/model/group-message-public";

import { GroupMessagePublicModel, GroupModel } from "../../../../model";

export const groupMessagePublicShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    const groupMessagePublicArray: Array<HydratedDocument<GroupMessagePublicInterface>> = await GroupMessagePublicModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();                         
    if (groupMessagePublicArray.length >= 1) {
        const textArray: Array<string> = groupMessagePublicArray.map((groupMessagePublicObject: HydratedDocument<GroupMessagePublicInterface>, groupMessagePublicIndex: number): string => {
            return `${groupMessagePublicIndex + 1}. ${groupMessagePublicObject.text}`;
        });

        await message.reply(textArray.join("\n\n"));
    } else {
        await message.reply("No Public Message Available");
    }
};

export const groupMessagePublicAdd = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 5);
        const argumentMessage: string = splittedMessage.join(" ");
        const groupMessagePublicArray: Array<HydratedDocument<GroupMessagePublicInterface>> = await GroupMessagePublicModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();                     
        if (!includeKey(groupMessagePublicArray, "text", argumentMessage)) {
            await GroupMessagePublicModel.create({
                _id: await latestModelId(GroupMessagePublicModel),
                id_group: groupObject._id,
                text: argumentMessage,
            });

            await message.reply("Public Message Added");
        } else {
            await message.reply("Public Message Already Used");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupMessagePublicRemove = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 5);
        const argumentMessage: string = splittedMessage.join(" ");
        const groupMessagePublicArray: Array<HydratedDocument<GroupMessagePublicInterface>> = await GroupMessagePublicModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();
        if (includeKey(groupMessagePublicArray, "text", argumentMessage)) {
            await GroupMessagePublicModel.deleteOne({ id_group: groupObject._id, text: argumentMessage });

            await message.reply("Public Message Removed");
        } else {
            await message.reply("Public Message Doesn't Exist");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
