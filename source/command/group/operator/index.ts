import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { includeKey, latestModelId } from "../../../utility";

import { GroupInterface } from "../../../common/interface/model/group";
import { GroupOperatorInterface } from "../../../common/interface/model/group-operator";

import { GroupModel, GroupOperatorModel } from "../../../model";

export const groupOperatorShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        const groupOperatorArray: Array<HydratedDocument<GroupOperatorInterface>> = await GroupOperatorModel.find({ id_group: groupObject._id }).select({ name: 1 }).lean();
        if (groupOperatorArray.length >= 1) {
            const textArray: Array<string> = groupOperatorArray.map((groupOperatorObject: HydratedDocument<GroupOperatorInterface>, groupOperatorIndex: number): string => {
                return `${groupOperatorIndex + 1}. ${groupOperatorObject.name}`;
            });

            await message.reply(textArray.join("\n"));
        } else {
            await message.reply("No Operator Available");
        }
    } else {
        await message.reply("Bot Doesn't Exist");
    }
};

export const groupOperatorAdd = async (message: Message, name: string, contact: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(name)) {
            const groupOperatorArray: Array<HydratedDocument<GroupOperatorInterface>> = await GroupOperatorModel.find({ id_group: groupObject._id })
                .select({ name: 1, contact: 1 })
                .lean();

            if (!includeKey(groupOperatorArray, "name", name)) {
                contact = `${contact.replace("@", "")}@c.us`;
                if (!includeKey(groupOperatorArray, "contact", contact)) {
                    await GroupOperatorModel.create({
                        _id: await latestModelId(GroupOperatorModel),
                        id_group: groupObject._id,
                        name: name,
                        contact: contact,
                    });

                    await message.reply("Operator Added");
                } else {
                    await message.reply("Operator Contact Already Used");
                }
            } else {
                await message.reply("Operator Name Already Used");
            }
        } else {
            await message.reply("Operator Name Invalid");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};

export const groupOperatorRemove = async (message: Message, name: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ _id: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(name)) {
            const groupOperatorArray: Array<HydratedDocument<GroupOperatorInterface>> = await GroupOperatorModel.find({ id_group: groupObject._id }).select({ name: 1 }).lean();
            if (includeKey(groupOperatorArray, "name", name)) {
                await GroupOperatorModel.deleteOne({
                    id_group: groupObject._id,
                    name: name,
                });

                await message.reply("Operator Remove");
            } else {
                await message.reply("Operator Doesn't Exist");
            }
        } else {
            await message.reply("Operator Invalid");
        }
    } else {
        await message.reply("Bot Doens't Exist");
    }
};
