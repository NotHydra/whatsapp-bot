import { Schema } from "mongoose";

import { GroupInterface } from "../common/interface/group";

export const groupSchema: Schema = new Schema<GroupInterface>({
    _id: {
        type: Number,
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
    prefix: {
        type: [String],
        required: true,
    },
    operator: {
        type: [String],
        required: true,
    },
    message: {
        type: [String],
        required: true,
    },
});
