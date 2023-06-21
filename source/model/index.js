const { connection } = require("mongoose");

const { adminSchema } = require("./admin");
const { groupSchema } = require("./group");

const database = connection.useDb("whatsapp");
const AdminModel = database.model("admin", adminSchema, "admin");
const GroupModel = database.model("group", groupSchema, "group");

module.exports = { AdminModel, GroupModel };
