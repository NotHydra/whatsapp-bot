import { Chat, GroupParticipant } from "whatsapp-web.js";

export interface ChatExtended extends Chat {
    participants?: Array<GroupParticipant>;
}
