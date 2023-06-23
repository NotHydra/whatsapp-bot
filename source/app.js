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
                                active: true,
                                prefix: [],
                                operator: [],
                                message: [],
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
                        if (splittedMessage.length == 3) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ prefix: 1 }).lean();

                            if (groupObject.prefix.length != 0) {
                                const textArray = groupObject.prefix.map((prefixObject, prefixIndex) => {
                                    return `${prefixIndex + 1}. ${prefixObject}`;
                                });

                                await message.reply(textArray.join("\n"));
                            } else {
                                await message.reply("No Prefix Available");
                            }
                        } else if (splittedMessage[3] == "add" && splittedMessage.length == 5) {
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
                    } else if (splittedMessage[2] == "message") {
                        if (splittedMessage.length == 3) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();

                            if (groupObject.message.length != 0) {
                                const textArray = groupObject.message.map((messageObject, messageIndex) => {
                                    return `${messageIndex + 1}. ${messageObject}`;
                                });

                                await message.reply(textArray.join("\n\n"));
                            } else {
                                await message.reply("No Message Available");
                            }
                        } else if (splittedMessage[3] == "add" && splittedMessage.length >= 5) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();
                            if (groupObject != null) {
                                splittedMessage.splice(0, 4);
                                const groupMessage = splittedMessage.join(" ");

                                const messageExist = groupObject.message.includes(groupMessage);
                                if (!messageExist) {
                                    groupObject.message.push(groupMessage);
                                    await GroupModel.updateOne(
                                        { remote: message.from },
                                        {
                                            message: groupObject.message,
                                        }
                                    ).lean();
                                    await message.reply("Message Added");
                                } else {
                                    await message.reply("Message Already Used");
                                }
                            } else {
                                await message.reply("Bot Doens't Exist");
                            }
                        } else if (splittedMessage[3] == "remove" && splittedMessage.length >= 5) {
                            const groupObject = await GroupModel.findOne({ remote: message.from }).select({ message: 1 }).lean();
                            if (groupObject != null) {
                                splittedMessage.splice(0, 4);
                                const groupMessage = splittedMessage.join(" ");

                                const messageExist = groupObject.message.includes(groupMessage);
                                if (messageExist) {
                                    const messageIndex = groupObject.message.indexOf(groupMessage);

                                    if (messageIndex != -1) {
                                        groupObject.message.splice(messageIndex, 1);

                                        await GroupModel.updateOne(
                                            { remote: message.from },
                                            {
                                                message: groupObject.message,
                                            }
                                        ).lean();

                                        await message.reply("Message Removed");
                                    } else {
                                        await message.reply("Message Failed To Be Removed");
                                    }
                                } else {
                                    await message.reply("Message Doesn't Exist");
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
            const groupObject = await GroupModel.findOne({ remote: notification.chatId }).select({ message: 1 }).lean();

            if (groupObject.message.length >= 1) {
                await notification.reply(groupObject.message[utility.randomNumber(0, groupObject.message.length)]);
            }
        }
    }
});

client.initialize();
