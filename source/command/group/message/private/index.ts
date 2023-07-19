import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { includeKey, latestModelId } from "../../../../utility";

import { ModelIdInterface } from "../../../../common/interface/model";
import { GroupInterface } from "../../../../common/interface/model/group";
import { GroupMessagePrivateInterface } from "../../../../common/interface/model/group-message-private";

import { GroupMessagePrivateModel, GroupModel } from "../../../../model";

export const groupMessagePrivateShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    const groupMessagePrivateArray: Array<HydratedDocument<GroupMessagePrivateInterface>> = await GroupMessagePrivateModel.find({ id_group: groupObject._id }).select({ text: 1 }).lean();                         
    if (groupMessagePrivateArray.length >= 1) {
        const textArray: Array<string> = groupMessagePrivateArray.map((groupMessagePrivateObject: HydratedDocument<GroupMessagePrivateInterface>, groupMessagePrivateIndex: number): string => {
            return `${groupMessagePrivateIndex + 1}. ${groupMessagePrivateObject.text}`;
        });

        await message.reply(textArray.join("\n\n"));
    } else {
        await message.reply("No Private Message Available");
    }
};

export const groupMessagePrivateActive = async (message: Message, value: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        const isExist: ModelIdInterface = await GroupMessagePrivateModel.exists({ id_group: groupObject._id }).lean();
        
        if (value == "true") {
            if (isExist == null) {
                await GroupMessagePrivateModel.create({
                    _id: 1,
                    id_group: groupObject._id,
                    text: " ",
                });
    
                await message.reply("Public Message Activated");
            } else {
                await message.reply("Private Message Already Activated");
            }
        } else {
            if (isExist != null) {
                await GroupMessagePrivateModel.deleteOne({
                    id_group: groupObject._id,
                });
    
                await message.reply("Public Message Deactivated");
            } else {
                await message.reply("Private Message Already Deactivated");
            }
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupMessagePrivateChange = async (message: Message, splittedMessage: Array<string>): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        splittedMessage.splice(0, 5);
        const argumentMessage: string = splittedMessage.join(" ");
        const isExist: ModelIdInterface = await GroupMessagePrivateModel.exists({ id_group: groupObject._id }).lean();

        if (isExist != null) {
            await GroupMessagePrivateModel.updateOne({ id_group: groupObject._id}, {text: argumentMessage});

            await message.reply("Private Message Changed");
        } else {
            await message.reply("Private Message Not Active");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
