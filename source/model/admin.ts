import { Schema } from "mongoose";

import { AdminInterface } from "../common/interface/model/admin";

export const adminSchema: Schema = new Schema<AdminInterface>({
    _id: {
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
    level: {
        type: Number,
        required: true,
    },
});
