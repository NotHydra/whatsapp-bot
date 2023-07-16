import { Schema } from "mongoose";

import { GroupRoleMemberInterface } from "../common/interface/model/group-role-member";

export const groupSchema: Schema = new Schema<GroupRoleMemberInterface>({
    _id: {
        type: Number,
        required: true,
    },
    id_group_role: {
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
