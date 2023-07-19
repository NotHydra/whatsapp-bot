import { Message } from "whatsapp-web.js";
import { HydratedDocument } from "mongoose";

import { latestModelId } from "../../utility";

import { ModelIdInterface } from "../../common/interface/model";
import { GroupRoleInterface } from "../../common/interface/model/group-role";

import { GroupExtensionModel, GroupMessagePrivateModel, GroupMessagePublicModel, GroupModel, GroupOperatorModel, GroupPrefixModel, GroupRoleMemberModel, GroupRoleModel } from "../../model";

export const groupInitialize = async (message: Message, name: string): Promise<void> => {
    const groupExist: ModelIdInterface = await GroupModel.exists({ remote: message.from }).lean();
    if (groupExist == null) {
        await GroupModel.create({
            _id: await latestModelId(GroupModel),
            name: name,
            remote: message.from,
            active: true,
        });

        await message.reply("Bot Initialized");
    } else {
        await message.reply("Bot Already Initialized");
    }
};

export const groupTerminate = async (message: Message): Promise<void> => {
    const groupExist: ModelIdInterface = await GroupModel.exists({ remote: message.from }).lean();
    if (groupExist != null) {
        const groupRoleArray: Array<HydratedDocument<GroupRoleInterface>> = await GroupRoleModel.find({ id_group: groupExist._id }).select({ _id: 1 }).lean();
        groupRoleArray.forEach(async (groupRoleObject: HydratedDocument<GroupRoleInterface>): Promise<void> => {
            await GroupRoleMemberModel.deleteMany({ id_group_role: groupRoleObject._id }).lean();
        });

        await GroupModel.deleteOne({ remote: message.from }).lean();
        await GroupOperatorModel.deleteMany({ id_group: groupExist._id }).lean();
        await GroupPrefixModel.deleteMany({ id_group: groupExist._id }).lean();
        await GroupRoleModel.deleteMany({ id_group: groupExist._id }).lean();
        await GroupMessagePublicModel.deleteMany({ id_group: groupExist._id }).lean();
        await GroupMessagePrivateModel.deleteMany({ id_group: groupExist._id }).lean();
        await GroupExtensionModel.deleteMany({ id_group: groupExist._id }).lean();

        await message.reply("Bot Terminated");
    } else {
        await message.reply("Bot Doesn't Exist");
    }
};
