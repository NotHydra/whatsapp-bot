const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const { Command } = require("./command");
const { Dependency } = require("./dependency");

const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox"] } });
const dependency = new Dependency();
const command = new Command();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Ready");
});

client.on("message", async (message) => {
    const splittedMessage = message.body.split(" ");

    if (dependency.defaultPrefixArray.includes(splittedMessage[0])) {
        if (dependency.adminArray.includes(message.author) || dependency.whitelistArray.includes(message.from)) {
            if (splittedMessage.length == 1) {
                await command.help(message);
            } else if (splittedMessage[1] == "everyone") {
                await command.everyone(message, chat, client);
            } else if (splittedMessage[1] == "credit") {
                await command.credit(message);
            } else if (splittedMessage[1] == "help") {
                await command.help(message);
            } else if (splittedMessage[1] == "test" && dependency.adminArray.includes(message.author)) {
                await command.test(message, chat, client);
            } else if (splittedMessage[1] == "group" && dependency.adminArray.includes(message.author)) {
                if (splittedMessage[2] == "initialize") {
                    dependency.whitelistArray.push(message.from);

                    await message.reply("Bot Initialized");
                } else if (splittedMessage[2] == "terminate") {
                    const whitelistRemoveIndex = dependency.whitelistArray.indexOf(message.from);

                    if (whitelistRemoveIndex != -1) {
                        dependency.whitelistArray.splice(whitelistRemoveIndex, 1);
                        await message.reply("Bot Terminated");
                    } else {
                        await message.reply("Bot Haven't Been Initialize Yet");
                    }
                }
            }
        }
    }
});

client.on("group_join", (notification) => {
    if (dependency.whitelistArray.includes(notification.chatId)) {
        if (notification.id.participant != dependency.botContact) {
            notification.reply("Selamat datang, mahasiswa baru jalur SNBP atau SNBT!");
        }
    }
});

client.initialize();
