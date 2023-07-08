import { GroupNotification } from "whatsapp-web.js";

export interface GroupNotificationExtended extends GroupNotification {
    id: {
        participant: string;
    };
}
