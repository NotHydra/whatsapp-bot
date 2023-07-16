import { HydratedDocument, Model } from "mongoose";

import { dbName, prefixArray } from "./depedency";

import { GroupInterface } from "./common/interface/model/group";
import { ModelIdInterface } from "./common/interface/model";

import { AdminModel, GroupModel } from "./model";

export const isAdmin = async (contact: string): Promise<boolean> => {
    const isExist: ModelIdInterface = await AdminModel.exists({ contact: contact }).lean();

    if (isExist != null) {
        return true;
    } else {
        return false;
    }
};

// export const prefixIsValid = async (remote: string, value: string): Promise<boolean> => {
//     const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: remote }).select({ prefix: 1 }).lean();

//     if (groupObject != null) {
//         return prefixArray.includes(value) || groupObject.prefix.includes(value);
//     } else {
//         return prefixArray.includes(value);
//     }
// };

export const groupIsValid = async (remote: string): Promise<boolean> => {
    const isExist: ModelIdInterface = await GroupModel.exists({ remote: remote }).lean();

    if (isExist != null) {
        return true;
    } else {
        return false;
    }
};

export const latestModelId = async <T>(model: Model<T>): Promise<number> => {
    const modelObject: ModelIdInterface = await model.findOne().select({ _id: 1 }).sort({ _id: -1 }).lean();

    if (modelObject != null) {
        return modelObject._id + 1;
    } else {
        return 1;
    }
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const developmentLog = (text: string): void => {
    if (dbName == "development") {
        console.log(text);
    }
};
