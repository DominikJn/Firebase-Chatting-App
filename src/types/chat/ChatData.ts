import { FieldValue, Timestamp } from "firebase/firestore";
import type ChatGroupType from "./ChatGroupType";

type ChatData = {
  id: string;
  users: string[];
  admins: string[];
  unseenBy: string[];
  type: ChatGroupType;
  chatName: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp | FieldValue;
};

export default ChatData;
