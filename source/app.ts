import { Chat, Client, Contact, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import mongoose, { HydratedDocument } from "mongoose";

import { botContact, dbURI } from "./depedency";
import { isAdmin, groupIsValid, prefixIsValid, randomNumber } from "./utility";

import { generalHelp, generalEveryone, generalCredit, generalTest } from "./command/general";

import { groupInitialize, groupTerminate } from "./command/group";
import { groupPrefixAdd, groupPrefixRemove, groupPrefixShow } from "./command/group/prefix";
import { groupMessageAdd, groupMessageRemove, groupMessageShow } from "./command/group/message";

import { GroupModel } from "./model";
import { GroupInterface } from "./common/interface/group";
import { GroupNotificationExtended } from "./common/interface/group-notification";

const client: Client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox", "--js-flags='--max_old_space_size=512'"] } });

client.on("qr", (qr: string): void => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async (): Promise<void> => {
    await mongoose.connect(dbURI);
    console.log("Bot Connected");
});

client.on("message", async (message: Message): Promise<void> => {
    if (message.body[0] == "!") {
        console.log("Test 1 1 Exclamation");

        const isAdminValue: boolean = await isAdmin(message.author);
        if (isAdminValue || (await groupIsValid(message.from))) {
            console.log("Test 1 2 Validation");

            const splittedMessage: Array<string> = message.body.split(" ");
            if (await prefixIsValid(message.from, splittedMessage[0])) {
                console.log("Test 1 3 Prefix");

                if (splittedMessage.length == 1) {
                    console.log("Test 1 A Default");

                    await generalHelp(message);
                } else if (splittedMessage[1] == "everyone") {
                    console.log("Test 1 B Everyone");

                    await generalEveryone(message, client);
                } else if (splittedMessage[1] == "credit") {
                    console.log("Test 1 C Credit");

                    await generalCredit(message);
                } else if (splittedMessage[1] == "help") {
                    console.log("Test 1 D Help");

                    await generalHelp(message);
                } else if (isAdminValue) {
                    if (splittedMessage[1] == "test") {
                        console.log("Test 1 E Test");

                        await generalTest(message, client);
                    } else if (splittedMessage[1] == "group") {
                        if (splittedMessage[2] == "initialize") {
                            console.log("Test 1 F Group Initialize");

                            groupInitialize(message);
                        } else if (splittedMessage[2] == "terminate") {
                            console.log("Test 1 G Group Terminate");

                            groupTerminate(message);
                        } else if (splittedMessage[2] == "prefix") {
                            if (splittedMessage.length == 3) {
                                console.log("Test 1 H Group Prefix");

                                groupPrefixShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length == 5) {
                                console.log("Test 1 I Group Prefix Add");

                                groupPrefixAdd(message, splittedMessage[4]);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length == 5) {
                                console.log("Test 1 J Group Prefix Remove");

                                groupPrefixRemove(message, splittedMessage[4]);
                            }
                        } else if (splittedMessage[2] == "message") {
                            if (splittedMessage.length == 3) {
                                console.log("Test 1 K Group Message");

                                groupMessageShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length >= 5) {
                                console.log("Test 1 L Group Message Add");

                                groupMessageAdd(message, splittedMessage);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length >= 5) {
                                console.log("Test 1 K Group Message Remove");

                                groupMessageRemove(message, splittedMessage);
                            }
                        }
                    }
                }
            }
        }
    }

    console.log();
});

client.on("group_join", async (notification: GroupNotificationExtended): Promise<void> => {
    if (await groupIsValid(notification.chatId)) {
        console.log("Test 2 1 Validation");

        if (notification.id.participant != botContact) {
            console.log("Test 2 2 Participant");

            const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: notification.chatId }).select({ message: 1 }).lean();
            if (groupObject.message.length >= 1) {
                console.log("Test 2 3 Message");

                const chat: Chat = await notification.getChat();
                const textArray: Array<string> = [];
                const mentionArray: Array<Contact> = await Promise.all(
                    notification.recipientIds.map(async (recipientObject: string): Promise<Contact> => {
                        textArray.push(`@${recipientObject.slice(0, -5)}`);
                        return await client.getContactById(recipientObject);
                    })
                );

                // await chat.sendMessage(`${textArray.join("\n")}\n\n${groupObject.message[randomNumber(0, groupObject.message.length)]}`, {
                //     mentions: mentionArray,
                // });
            }
        }
    }

    console.log();
});

client.initialize();
