import { Schema } from "mongoose";

import { GroupOperatorInterface } from "../common/interface/model/group-operator";

export const groupSchema: Schema = new Schema<GroupOperatorInterface>({
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
    contact: {
        type: String,
        required: true,
    },
});
