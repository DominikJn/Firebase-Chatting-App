import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";

type ChatData = {
  id: string;
  users: UserData[];
  chatName: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
};

export default ChatData;
