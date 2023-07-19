import { Schema } from "mongoose";

import { GroupPrivateMessageInterface } from "../common/interface/model/group-private-message";

export const groupPrivateMessageSchema: Schema = new Schema<GroupPrivateMessageInterface>({
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
