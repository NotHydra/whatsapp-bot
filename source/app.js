const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const { Command } = require("./command");

const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox"] } });
const command = new Command();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Ready");
});

client.on("message", async (message) => {
    const splittedMessage = message.body.split(" ");

    if (splittedMessage.length == 1) {
        await command.help(message);
    } else if (splittedMessage[0] == "!its") {
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

client.on("group_join", async (notification) => {
    const contact = await notification.getContact();
    notification.reply(`Selamat datang @${contact.id.user}`, {
        mentions: [contact],
    });
});

client.initialize();
