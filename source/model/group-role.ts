import { Schema } from "mongoose";

import { GroupRoleInterface } from "../common/interface/model/group-role";

export const groupRoleSchema: Schema = new Schema<GroupRoleInterface>({
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
