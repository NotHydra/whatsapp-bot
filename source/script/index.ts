import * as fs from "fs";
import mongoose, { HydratedDocument } from "mongoose";

import { dbURI } from "../depedency";

import { GroupInterface } from "../common/interface/group";
import { AdminInterface } from "../common/interface/model/admin";

import { AdminModel, GroupModel } from "../model";

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

(async (): Promise<void> => {
    await mongoose.connect(dbURI).then(async (): Promise<void> => {
        // exportData();
        // importData();

        console.log("Done");
    });
})();
