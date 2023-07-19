import { Schema } from "mongoose";

import { GroupMessagePublicInterface } from "../common/interface/model/group-message-public";

export const groupMessagePublicSchema: Schema = new Schema<GroupMessagePublicInterface>({
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
