import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { includeKey, latestModelId } from "../../../utility";

import { GroupInterface } from "../../../common/interface/model/group";
import { GroupPrefixInterface } from "../../../common/interface/model/group-prefix";

import { GroupModel, GroupPrefixModel } from "../../../model";

export const groupPrefixShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        const groupPrefixArray: Array<HydratedDocument<GroupPrefixInterface>> = await GroupPrefixModel.find({ id_group: groupObject._id }).select({ name: 1 }).lean();
        if (groupPrefixArray.length >= 1) {
            const textArray: Array<string> = groupPrefixArray.map((groupPrefixObject: HydratedDocument<GroupPrefixInterface>, groupPrefixIndex: number): string => {
                return `${groupPrefixIndex + 1}. ${groupPrefixObject.name}`;
            });

            await message.reply(textArray.join("\n"));
        } else {
            await message.reply("No Prefix Available");
        }
    } else {
        await message.reply("Bot Doesn't Exist");
    }
};

export const groupPrefixAdd = async (message: Message, value: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(value)) {
            const groupPrefixArray: Array<HydratedDocument<GroupPrefixInterface>> = await GroupPrefixModel.find({ id_group: groupObject._id }).select({ name: 1 }).lean();
            if (!includeKey(groupPrefixArray, "name", `!${value}`)) {
                await GroupPrefixModel.create({
                    _id: await latestModelId(GroupPrefixModel),
                    id_group: groupObject._id,
                    name: `!${value}`,
                });

                await message.reply("Prefix Added");
            } else {
                await message.reply("Prefix Already Used");
            }
        } else {
            await message.reply("Prefix Invalid");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupPrefixRemove = async (message: Message, value: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(value)) {
            const groupPrefixArray: Array<HydratedDocument<GroupPrefixInterface>> = await GroupPrefixModel.find({ id_group: groupObject._id }).select({ name: 1 }).lean();
            if (includeKey(groupPrefixArray, "name", `!${value}`)) {
                await GroupPrefixModel.deleteOne({
                    id_group: groupObject._id,
                    name: `!${value}`,
                });

                await message.reply("Prefix Remove");
            } else {
                await message.reply("Prefix Doesn't Exist");
            }
        } else {
            await message.reply("Prefix Invalid");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
