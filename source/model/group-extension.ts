import { Schema } from "mongoose";

import { GroupExtensionInterface } from "../common/interface/model/group-extension";

export const groupExtensionSchema: Schema = new Schema<GroupExtensionInterface>({
    _id: {
        type: Number,
        required: true,
    },
    id_group: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});
