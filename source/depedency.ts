import { CommandInterface } from "./common/interface/command";

require("dotenv").config();

export const dbURI: string = process.env.DB_URI;

export const botContact: string = process.env.BOT_CONTACT;
export const prefixArray: Array<string> = ["!hyd", "!hydra", "!if", "!informatika"];
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
