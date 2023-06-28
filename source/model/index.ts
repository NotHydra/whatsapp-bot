import { Connection, Model, connection } from "mongoose";

import { AdminInterface } from "../common/interface/admin";
import { GroupInterface } from "../common/interface/group";

import { adminSchema } from "./admin";
import { groupSchema } from "./group";

const database: Connection = connection.useDb("whatsapp-v2");
export const AdminModel: Model<AdminInterface> = database.model<AdminInterface>("admin", adminSchema, "admin");
export const GroupModel: Model<GroupInterface> = database.model<GroupInterface>("group", groupSchema, "group");
