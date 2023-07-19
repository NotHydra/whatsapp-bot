import { Connection, Model, connection } from "mongoose";

import { dbName } from "../depedency";

import { AdminInterface } from "../common/interface/model/admin";

import { GroupInterface } from "../common/interface/model/group";
import { GroupOperatorInterface } from "../common/interface/model/group-operator";
import { GroupPrefixInterface } from "../common/interface/model/group-prefix";
import { GroupRoleInterface } from "../common/interface/model/group-role";
import { GroupRoleMemberInterface } from "../common/interface/model/group-role-member";
import { GroupMessagePublicInterface } from "../common/interface/model/group-message-public";
import { GroupMessagePrivateInterface } from "../common/interface/model/group-message-private";
import { GroupExtensionInterface } from "../common/interface/model/group-extension";

import { adminSchema } from "./admin";

import { groupSchema } from "./group";
import { groupOperatorSchema } from "./group-operator";
import { groupPrefixSchema } from "./group-prefix";
import { groupRoleSchema } from "./group-role";
import { groupRoleMemberSchema } from "./group-role-member";
import { groupMessagePublicSchema } from "./group-message-public";
import { groupMessagePrivateSchema } from "./group-message-private";
import { groupExtensionSchema } from "./group-extension";

const database: Connection = connection.useDb(dbName);

export const AdminModel: Model<AdminInterface> = database.model<AdminInterface>("admin", adminSchema, "admin");

export const GroupModel: Model<GroupInterface> = database.model<GroupInterface>("group", groupSchema, "group");
export const GroupOperatorModel: Model<GroupOperatorInterface> = database.model<GroupOperatorInterface>("group-operator", groupOperatorSchema, "group-operator");
export const GroupPrefixModel: Model<GroupPrefixInterface> = database.model<GroupPrefixInterface>("group-prefix", groupPrefixSchema, "group-prefix");
export const GroupRoleModel: Model<GroupRoleInterface> = database.model<GroupRoleInterface>("group-role", groupRoleSchema, "group-role");
export const GroupRoleMemberModel: Model<GroupRoleMemberInterface> = database.model<GroupRoleMemberInterface>("group-role-member", groupRoleMemberSchema, "group-role-member");
export const GroupMessagePublicModel: Model<GroupMessagePublicInterface> = database.model<GroupMessagePublicInterface>(
    "group-message-public",
    groupMessagePublicSchema,
    "group-message-public"
);
export const GroupMessagePrivateModel: Model<GroupMessagePrivateInterface> = database.model<GroupMessagePrivateInterface>(
    "group-message-private",
    groupMessagePrivateSchema,
    "group-message-private"
);
export const GroupExtensionModel: Model<GroupExtensionInterface> = database.model<GroupExtensionInterface>("group-extension", groupExtensionSchema, "group-extension");
