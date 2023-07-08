import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { GroupInterface } from "../../../common/interface/group";

import { GroupModel } from "../../../model";

export const groupPrefixShow = async (message: Message): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();
    if (groupObject.prefix.length != 0) {
        const textArray: Array<string> = groupObject.prefix.map((prefixObject: string, prefixIndex: number): string => {
            return `${prefixIndex + 1}. ${prefixObject}`;
        });

        await message.reply(textArray.join("\n"));
    } else {
        await message.reply("No Prefix Available");
    }
};

export const groupPrefixAdd = async (message: Message, value: string): Promise<void> => {
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(value)) {
            if (!groupObject.prefix.includes(`!${value}`)) {
                groupObject.prefix.push(`!${value}`);
                await GroupModel.updateOne(
                    { remote: message.from },
                    {
                        prefix: groupObject.prefix,
                    }
                ).lean();

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
    const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();
    if (groupObject != null) {
        if (/^[a-z]+$/.test(value)) {
            if (groupObject.prefix.includes(`!${value}`)) {
                const prefixIndex: number = groupObject.prefix.indexOf(`!${value}`);
                if (prefixIndex != -1) {
                    groupObject.prefix.splice(prefixIndex, 1);
                    await GroupModel.updateOne(
                        { remote: message.from },
                        {
                            prefix: groupObject.prefix,
                        }
                    ).lean();

                    await message.reply("Prefix Remove");
                } else {
                    await message.reply("Prefix Failed To Be Removed");
                }
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
