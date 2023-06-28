import { Schema } from "mongoose";

import { AdminInterface } from "../common/interface/admin";

export const adminSchema: Schema = new Schema<AdminInterface>({
    _id: {
        type: Number,
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
