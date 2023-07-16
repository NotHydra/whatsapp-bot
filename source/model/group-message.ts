import { Schema } from "mongoose";

import { GroupMessageInterface } from "../common/interface/model/group-message";

export const groupMessageSchema: Schema = new Schema<GroupMessageInterface>({
    _id: {
        type: Number,
        required: true,
    },
    id_group: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});
