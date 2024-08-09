import { FieldValue, Timestamp } from "firebase/firestore";
import type UserData from "../UserData";
import type ChatGroupType from "./ChatGroupType";

type ChatData = {
  id: string;
  userIds: string[];
  users: UserData[];
  admins: string[];
  type: ChatGroupType;
  chatName: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp | FieldValue;
};

export default ChatData;
