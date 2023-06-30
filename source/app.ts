import { Chat, Client, Contact, GroupNotification, LocalAuth, Message } from "whatsapp-web.js";
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

const client: Client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox"] } });

client.on("qr", (qr: string): void => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async (): Promise<void> => {
    await mongoose.connect(dbURI);
    console.log("Bot Connected");
});

client.on("message", async (message: Message): Promise<void> => {
    if (message.body[0] == "!") {
        const isAdminValue: boolean = await isAdmin(message.author);
        if (isAdminValue || (await groupIsValid(message.from))) {
            const splittedMessage: Array<string> = message.body.split(" ");
            if (await prefixIsValid(message.from, splittedMessage[0])) {
                if (splittedMessage.length == 1) {
                    await generalHelp(message);
                } else if (splittedMessage[1] == "everyone") {
                    await generalEveryone(message, client);
                } else if (splittedMessage[1] == "credit") {
                    await generalCredit(message);
                } else if (splittedMessage[1] == "help") {
                    await generalHelp(message);
                } else if (isAdminValue) {
                    if (splittedMessage[1] == "test") {
                        await generalTest(message, client);
                    } else if (splittedMessage[1] == "group") {
                        if (splittedMessage[2] == "initialize") {
                            groupInitialize(message);
                        } else if (splittedMessage[2] == "terminate") {
                            groupTerminate(message);
                        } else if (splittedMessage[2] == "prefix") {
                            if (splittedMessage.length == 3) {
                                groupPrefixShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length == 5) {
                                groupPrefixAdd(message, splittedMessage[4]);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length == 5) {
                                groupPrefixRemove(message, splittedMessage[4]);
                            }
                        } else if (splittedMessage[2] == "message") {
                            if (splittedMessage.length == 3) {
                                groupMessageShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length >= 5) {
                                groupMessageAdd(message, splittedMessage);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length >= 5) {
                                groupMessageRemove(message, splittedMessage);
                            }
                        }
                    }
                }
            }
        }
    }
});

client.on("group_join", async (notification: GroupNotification | any): Promise<void> => {
    if (await groupIsValid(notification.chatId)) {
        if (notification.id.participant != botContact) {
            const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: notification.chatId }).select({ message: 1 }).lean();

            if (groupObject.message.length >= 1) {
                const chat: Chat = await notification.getChat();
                const textArray: Array<string> = [];
                const mentionArray: Array<Contact> = await Promise.all(
                    notification.recipientIds.map(async (recipientObject: string) => {
                        textArray.push(`@${recipientObject.slice(0, -5)}`);
                        return await client.getContactById(recipientObject);
                    })
                );

                await chat.sendMessage(`${textArray.join("\n")}\n\n${groupObject.message[randomNumber(0, groupObject.message.length)]}`, {
                    mentions: mentionArray,
                });
            }
        }
    }
});

client.initialize();
