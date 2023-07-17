import * as fs from "fs";
import mongoose, { HydratedDocument } from "mongoose";

import { dbURI } from "../depedency";

import { GroupInterface } from "../common/interface/model/group";
import { AdminInterface } from "../common/interface/model/admin";
import { GroupOperatorInterface } from "../common/interface/model/group-operator";
import { GroupPrefixInterface } from "../common/interface/model/group-prefix";
import { GroupRoleInterface } from "../common/interface/model/group-role";
import { GroupRoleMemberInterface } from "../common/interface/model/group-role-member";
import { GroupMessageInterface } from "../common/interface/model/group-message";
import { GroupExtensionInterface } from "../common/interface/model/group-extension";

import { AdminModel, GroupExtensionModel, GroupMessageModel, GroupModel, GroupOperatorModel, GroupPrefixModel, GroupRoleMemberModel, GroupRoleModel } from "../model";

interface GroupRawInterface {
    _id: number;
    remote: string;
    active: boolean;
    prefix: Array<string>;
    operator: Array<string>;
    message: Array<string>;
}

const exportData = async (): Promise<void> => {
    const groupArray: Array<HydratedDocument<GroupInterface>> = await GroupModel.find().lean();
    const adminArray: Array<HydratedDocument<AdminInterface>> = await AdminModel.find().lean();

    const currentDate: string = new Date().toISOString();
    fs.writeFileSync(`source/script/json/backup/group/${currentDate}.json`, JSON.stringify(groupArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/backup/admin/${currentDate}.json`, JSON.stringify(adminArray, null, 4), "utf8");
};

const importData = async (): Promise<void> => {
    const groupArray: string = JSON.parse(fs.readFileSync("source/script/json/backup/group.json", "utf8"));
    const adminArray: string = JSON.parse(fs.readFileSync("source/script/json/backup/admin.json", "utf8"));

    await GroupModel.deleteMany();
    await AdminModel.deleteMany();

    await GroupModel.insertMany(groupArray);
    await AdminModel.insertMany(adminArray);
};

const convertData = async (): Promise<void> => {
    const groupRawArray: Array<GroupRawInterface> = JSON.parse(fs.readFileSync("source/script/json/convert/group-raw.json", "utf8"));

    let groupId: number = 1;
    let groupOperatorId: number = 1;
    let groupPrefixId: number = 1;
    let groupRoleId: number = 1;
    let groupRoleMemberId: number = 1;
    let groupMessageId: number = 1;
    let groupExtensionId: number = 1;

    const groupArray: Array<GroupInterface> = [];
    const groupOperatorArray: Array<GroupOperatorInterface> = [];
    const groupPrefixArray: Array<GroupPrefixInterface> = [];
    const groupRoleArray: Array<GroupRoleInterface> = [];
    const groupRoleMemberArray: Array<GroupRoleMemberInterface> = [];
    const groupMessageArray: Array<GroupMessageInterface> = [];
    const groupExtensionArray: Array<GroupExtensionInterface> = [];

    groupRawArray.forEach((groupRawObject: GroupRawInterface) => {
        groupArray.push({ _id: groupId, name: `Test ${groupId}`, remote: groupRawObject.remote, active: groupRawObject.active });

        groupRawObject.operator.forEach((groupRawOperatorObject: string) => {
            groupOperatorArray.push({ _id: groupOperatorId, id_group: groupId, name: `Test ${groupOperatorId}`, contact: groupRawOperatorObject });

            groupOperatorId += 1;
        });

        groupRawObject.prefix.forEach((groupRawPrefixObject: string) => {
            groupPrefixArray.push({ _id: groupPrefixId, id_group: groupId, name: groupRawPrefixObject });

            groupPrefixId += 1;
        });

        groupRawObject.message.forEach((groupRawMessageObject: string) => {
            groupMessageArray.push({ _id: groupMessageId, id_group: groupId, text: groupRawMessageObject });

            groupMessageId += 1;
        });

        groupId += 1;
    });

    fs.writeFileSync(`source/script/json/convert/group.json`, JSON.stringify(groupArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-operator.json`, JSON.stringify(groupOperatorArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-prefix.json`, JSON.stringify(groupPrefixArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-role.json`, JSON.stringify(groupRoleArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-role-member.json`, JSON.stringify(groupRoleMemberArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-message.json`, JSON.stringify(groupMessageArray, null, 4), "utf8");
    fs.writeFileSync(`source/script/json/convert/group-extension.json`, JSON.stringify(groupExtensionArray, null, 4), "utf8");
};

const importDataV3 = async (): Promise<void> => {
    const dataArray: any = [
        ["source/script/json/convert/admin.json", AdminModel],
        ["source/script/json/convert/group.json", GroupModel],
        ["source/script/json/convert/group-operator.json", GroupOperatorModel],
        ["source/script/json/convert/group-prefix.json", GroupPrefixModel],
        ["source/script/json/convert/group-role.json", GroupRoleModel],
        ["source/script/json/convert/group-role-member.json", GroupRoleMemberModel],
        ["source/script/json/convert/group-message.json", GroupMessageModel],
        ["source/script/json/convert/group-extension.json", GroupExtensionModel],
    ];

    dataArray.forEach(async (dataObject: any) => {
        const jsonArray: string = JSON.parse(fs.readFileSync(dataObject[0], "utf8"));
        await dataObject[1].deleteMany();
        await dataObject[1].insertMany(jsonArray);
    });
};

(async (): Promise<void> => {
    await mongoose.connect(dbURI).then(async (): Promise<void> => {
        // exportData();
        // importData();
        // convertData();
        importDataV3();

        console.log("Done");
    });
})();
