import { Chat, Client, Contact, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import mongoose, { HydratedDocument } from "mongoose";

import { botContact, dbURI } from "./depedency";
import { isAdmin, groupIsValid, prefixIsValid, randomNumber, developmentLog } from "./utility";

import { generalHelp, generalEveryone, generalCredit, generalTest } from "./command/general";

import { groupInitialize, groupTerminate } from "./command/group";
import { groupOperatorShow, groupOperatorAdd, groupOperatorRemove } from "./command/group/operator";
import { groupPrefixAdd, groupPrefixRemove, groupPrefixShow } from "./command/group/prefix";
import { groupMessagePublicAdd, groupMessagePublicRemove, groupMessagePublicShow } from "./command/group/message/public";
import { groupMessagePrivateActive, groupMessagePrivateChange, groupMessagePrivateShow } from "./command/group/message/private";

import { GroupInterface } from "./common/interface/model/group";
import { GroupNotificationExtended } from "./common/interface/group-notification";
import { GroupMessagePublicInterface } from "./common/interface/model/group-message-public";
import { GroupMessagePrivateInterface } from "./common/interface/model/group-message-private";

import { GroupMessagePrivateModel, GroupMessagePublicModel, GroupModel } from "./model";

const client: Client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox", "--js-flags='--max_old_space_size=256'"] } });

client.on("qr", (qr: string): void => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async (): Promise<void> => {
    await mongoose.connect(dbURI).then(() => {
        console.log("Bot Connected");
    });
});

client.on("message", async (message: Message): Promise<void> => {
    if (message.body[0] == "!") {
        developmentLog("Message (Exclamation Validation)");

        const groupIsValidValue = await groupIsValid(message.from);
        let isAdminValue: boolean = false;

        if (!groupIsValidValue) {
            isAdminValue = await isAdmin(message.author);
        }

        if (groupIsValidValue || isAdminValue) {
            developmentLog("Message (Group or Admin Validation)");

            const splittedMessage: Array<string> = message.body.split(" ");
            if (await prefixIsValid(message.from, splittedMessage[0])) {
                developmentLog("Message (Prefix Validation)");

                if (splittedMessage.length == 1) {
                    developmentLog("Message (Default)");

                    await generalHelp(message);
                } else if (splittedMessage[1] == "everyone") {
                    developmentLog("Message (Everyone)");

                    await generalEveryone(message, client);
                } else if (splittedMessage[1] == "credit") {
                    developmentLog("Message (Credit)");

                    await generalCredit(message);
                } else if (splittedMessage[1] == "help") {
                    developmentLog("Message (Help)");

                    await generalHelp(message);
                } else if (isAdminValue || (await isAdmin(message.author))) {
                    developmentLog("Message (Admin Validation)");

                    if (splittedMessage[1] == "test") {
                        developmentLog("Message (Test)");

                        await generalTest(message, client);
                    } else if (splittedMessage[1] == "group") {
                        if (splittedMessage[2] == "initialize" && splittedMessage.length == 4) {
                            developmentLog("Message (Group Initialize)");

                            groupInitialize(message, splittedMessage[3]);
                        } else if (splittedMessage[2] == "terminate") {
                            developmentLog("Message (Group Terminate)");

                            groupTerminate(message);
                        } else if (splittedMessage[2] == "prefix") {
                            if (splittedMessage.length == 3) {
                                developmentLog("Message (Group Prefix)");

                                groupPrefixShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length == 5) {
                                developmentLog("Message (Group Prefix Add)");

                                groupPrefixAdd(message, splittedMessage[4]);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length == 5) {
                                developmentLog("Message (Group Prefix Remove)");

                                groupPrefixRemove(message, splittedMessage[4]);
                            }
                        } else if (splittedMessage[2] == "operator") {
                            if (splittedMessage.length == 3) {
                                developmentLog("Message (Group Operator)");

                                groupOperatorShow(message);
                            } else if (splittedMessage[3] == "add" && splittedMessage.length == 6) {
                                developmentLog("Message (Group Operator Add)");

                                groupOperatorAdd(message, splittedMessage[4], splittedMessage[5]);
                            } else if (splittedMessage[3] == "remove" && splittedMessage.length == 5) {
                                developmentLog("Message (Group Operator Remove)");

                                groupOperatorRemove(message, splittedMessage[4]);
                            }
                        } else if (splittedMessage[2] == "message") {
                            if (splittedMessage[3] == "public") {
                                if (splittedMessage.length == 4) {
                                    developmentLog("Message (Group Message Public)");

                                    groupMessagePublicShow(message);
                                } else if (splittedMessage[4] == "add" && splittedMessage.length >= 6) {
                                    developmentLog("Message (Group Message Public Add)");

                                    groupMessagePublicAdd(message, splittedMessage);
                                } else if (splittedMessage[4] == "remove" && splittedMessage.length >= 6) {
                                    developmentLog("Message (Group Message Public Remove)");

                                    groupMessagePublicRemove(message, splittedMessage);
                                }
                            } else if (splittedMessage[3] == "private") {
                                if (splittedMessage.length == 4) {
                                    developmentLog("Message (Group Message Private)");

                                    groupMessagePrivateShow(message);
                                } else if (splittedMessage[4] == "active" && ["true", "false"].includes(splittedMessage[5])) {
                                    developmentLog("Message (Group Message Private Active)");

                                    groupMessagePrivateActive(message, splittedMessage[5]);
                                } else if (splittedMessage[4] == "change" && splittedMessage.length >= 6) {
                                    developmentLog("Message (Group Message Private Change)");

                                    groupMessagePrivateChange(message, splittedMessage);
                                }
                            }
                        }
                    }
                }
            }
        }

        developmentLog("");
    }
});

client.on("group_join", async (notification: GroupNotificationExtended): Promise<void> => {
    if (await groupIsValid(notification.chatId)) {
        developmentLog("Group Join (Group Validation)");

        if (notification.id.participant != botContact) {
            developmentLog("Group Join (Not Self Validation)");

            const groupObject: HydratedDocument<GroupInterface> = await GroupModel.findOne({ remote: notification.chatId }).select({ _id: 1 }).lean();
            const groupMessagePublicArray: Array<HydratedDocument<GroupMessagePublicInterface>> = await GroupMessagePublicModel.find({ id_group: groupObject._id })
                .select({ text: 1 })
                .lean();

            const groupMessagePrivateObject: HydratedDocument<GroupMessagePrivateInterface> = await GroupMessagePrivateModel.findOne({ id_group: groupObject._id })
                .select({ text: 1 })
                .lean();

            if (groupMessagePublicArray.length >= 1) {
                developmentLog("Group Join (Message Public)");

                const chat: Chat = await notification.getChat();
                const textArray: Array<string> = [];
                const mentionArray: Array<Contact> = await Promise.all(
                    notification.recipientIds.map(async (recipientObject: string): Promise<Contact> => {
                        textArray.push(`@${recipientObject.slice(0, -5)}`);
                        return await client.getContactById(recipientObject);
                    })
                );

                await chat.sendMessage(`${textArray.join("\n")}\n\n${groupMessagePublicArray[randomNumber(0, groupMessagePublicArray.length)].text}`, {
                    mentions: mentionArray,
                });
            }

            if (groupMessagePrivateObject != null && groupMessagePrivateObject.text != " ") {
                developmentLog("Group Join (Message Private)");

                notification.recipientIds.forEach(async (recipientObject: string): Promise<void> => {
                    await client.sendMessage(recipientObject, groupMessagePrivateObject.text);
                });
            }
        }

        developmentLog("");
    }
});

client.initialize();
