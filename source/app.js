import whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

import { Command } from "./command.js";

const { Client, LocalAuth } = whatsapp;
const { generate } = qrcode;

const client = new Client({ authStrategy: new LocalAuth() });
const command = new Command();

client.on("qr", (qr) => {
    generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Ready");
});

client.on("message", async (message) => {
    const splittedMessage = message.body.split(" ");

    if (splittedMessage[0] == "!its") {
        const chat = await message.getChat();

        if (chat.isGroup) {
            if (splittedMessage[1] == "everyone") {
                await command.everyone(message, chat, client);
            } else if (splittedMessage[1] == "credit") {
                await command.credit(message);
            } else if (splittedMessage[1] == "help") {
                await command.help(message);
            } else if (splittedMessage[1] == "test") {
                await command.test(message, chat, client);
            }
        }
    }
});

client.initialize();
