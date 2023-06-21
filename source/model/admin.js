const { Schema } = require("mongoose");

const adminSchema = new Schema({
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

module.exports = { adminSchema };
