const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const { Dependency } = require("./dependency");
const { mongoose } = require("mongoose");
const { Utility } = require("./utility");
const { Command } = require("./command");

const { GroupModel } = require("./model");

const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox"] } });

const dependency = new Dependency();
const utility = new Utility();
const command = new Command();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
    await mongoose.connect(dependency.dbURI);
    console.log("Bot Connected");
});

client.on("message", async (message) => {
    const splittedMessage = message.body.split(" ");

    if ((await utility.isAdmin(message.author)) || (await utility.groupIsValid(message.from))) {
        if (await utility.prefixIsValid(message.from, splittedMessage[0])) {
            if (splittedMessage.length == 1) {
                await command.help(message);
            } else if (splittedMessage[1] == "everyone") {
                await command.everyone(message, client);
            } else if (splittedMessage[1] == "credit") {
                await command.credit(message);
            } else if (splittedMessage[1] == "help") {
                await command.help(message);
            } else if (await utility.isAdmin(message.author)) {
                if (splittedMessage[1] == "test") {
                    await command.test(message, client);
                } else if (splittedMessage[1] == "group") {
                    if (splittedMessage[2] == "initialize") {
                        const groupExist = await GroupModel.exists({ remote: message.from }).lean();
                        if (groupExist == null) {
                            await GroupModel.create({
                                _id: await utility.latestModelId(GroupModel),
                                remote: message.from,
                                prefix: [],
                                operator: [],
                            });
                            await message.reply("Bot Initialized");
                        } else {
                            await message.reply("Bot Already Initialized");
                        }
                    } else if (splittedMessage[2] == "terminate") {
                        const groupExist = await GroupModel.exists({ remote: message.from }).lean();
                        if (groupExist != null) {
                            await GroupModel.deleteOne({ remote: message.from }).lean();
                            await message.reply("Bot Terminated");
                        } else {
                            await message.reply("Bot Doesn't Exist");
                        }
                    } else if (splittedMessage[2] == "prefix") {
                        if (splittedMessage[3] == "add" && splittedMessage.length == 5) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();
                            if (groupObject != null) {
                                if (/^[a-z]+$/.test(splittedMessage[4])) {
                                    const prefixExist = groupObject.prefix.includes(`!${splittedMessage[4]}`);
                                    if (!prefixExist) {
                                        groupObject.prefix.push(`!${splittedMessage[4]}`);
                                        await GroupModel.updateOne(
                                            { remote: message.from },
                                            {
                                                prefix: groupObject.prefix,
                                            }
                                        ).lean();
                                        await message.reply("Prefix Added");
                                    } else {
                                        await message.reply("Prefix Already Used");
                                    }
                                } else {
                                    await message.reply("Prefix Invalid");
                                }
                            } else {
                                await message.reply("Bot Doens't Exist");
                            }
                        } else if (splittedMessage[3] == "remove" && splittedMessage.length == 5) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();
                            if (groupObject != null) {
                                if (/^[a-z]+$/.test(splittedMessage[4])) {
                                    const prefixExist = groupObject.prefix.includes(`!${splittedMessage[4]}`);
                                    if (prefixExist) {
                                        const prefixIndex = groupObject.prefix.indexOf(`!${splittedMessage[4]}`);

                                        if (prefixIndex != -1) {
                                            groupObject.prefix.splice(prefixIndex, 1);

                                            await GroupModel.updateOne(
                                                { remote: message.from },
                                                {
                                                    prefix: groupObject.prefix,
                                                }
                                            ).lean();

                                            await message.reply("Prefix Remove");
                                        } else {
                                            await message.reply("Prefix Failed To Be Removed");
                                        }
                                    } else {
                                        await message.reply("Prefix Doesn't Exist");
                                    }
                                } else {
                                    await message.reply("Prefix Invalid");
                                }
                            } else {
                                await message.reply("Bot Doens't Exist");
                            }
                        }
                    }
                }
            }
        }
    }
});

client.on("group_join", async (notification) => {
    if (await utility.groupIsValid(notification.chatId)) {
        if (notification.id.participant != dependency.botContact) {
            notification.reply("Selamat datang!");
        }
    }

    console.log();
});

client.initialize();
