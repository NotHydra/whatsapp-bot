const { Schema } = require("mongoose");

const groupSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    remote: {
        type: String,
        required: true,
    },
    prefix: {
        type: [String],
        required: true,
    },
    operator: {
        type: [String],
        required: true,
    },
});

module.exports = { groupSchema };
