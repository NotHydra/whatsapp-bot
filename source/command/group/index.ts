import { Message } from "whatsapp-web.js";

import { latestModelId } from "../../utility";

import { ModelIdInterface } from "../../common/interface/model";

import { GroupModel } from "../../model";

export const groupInitialize = async (message: Message): Promise<void> => {
    const groupExist: ModelIdInterface = await GroupModel.exists({ remote: message.from }).lean();
    if (groupExist == null) {
        await GroupModel.create({
            _id: await latestModelId(GroupModel),
            remote: message.from,
            active: true,
            prefix: [],
            operator: [],
            message: [],
        });

        await message.reply("Bot Initialized");
    } else {
        await message.reply("Bot Already Initialized");
    }
};

export const groupTerminate = async (message: Message): Promise<void> => {
    const groupExist: ModelIdInterface = await GroupModel.exists({ remote: message.from }).lean();
    if (groupExist != null) {
        await GroupModel.deleteOne({ remote: message.from }).lean();
        await message.reply("Bot Terminated");
    } else {
        await message.reply("Bot Doesn't Exist");
    }
};
