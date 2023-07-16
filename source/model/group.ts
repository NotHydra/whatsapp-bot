import { Schema } from "mongoose";

import { GroupInterface } from "../common/interface/model/group";

export const groupSchema: Schema = new Schema<GroupInterface>({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    remote: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
});
