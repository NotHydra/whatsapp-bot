import { Schema } from "mongoose";

import { GroupMessagePrivateInterface } from "../common/interface/model/group-message-private";

export const groupMessagePrivateSchema: Schema = new Schema<GroupMessagePrivateInterface>({
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
