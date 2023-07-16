import { PrefixInterface } from "./common/interface/prefix";
import { CommandInterface } from "./common/interface/command";

require("dotenv").config();

export const dbURI: string = process.env.DB_URI;
export const dbName: string = process.env.DB_NAME;

export const botContact: string = process.env.BOT_CONTACT;
export const prefixArray: Array<PrefixInterface> = [
    {
        id: 1,
        name: "!hyd",
    },
    {
        id: 2,
        name: "!hydra",
    },
    {
        id: 3,
        name: "!if",
    },
    {
        id: 4,
        name: "!informatika",
    },
];

export const commandArray: Array<CommandInterface> = [
    {
        id: 1,
        command: "everyone",
        description: "mentions every member",
    },
    {
        id: 2,
        command: "credit",
        description: "creator's social media",
    },
    {
        id: 3,
        command: "help",
        description: "list all command",
    },
];
