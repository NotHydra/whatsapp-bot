import { Schema } from "mongoose";

import { GroupPrefixInterface } from "../common/interface/model/group-prefix";

export const groupSchema: Schema = new Schema<GroupPrefixInterface>({
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
