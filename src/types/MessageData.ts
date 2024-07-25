import { Timestamp } from "firebase/firestore";

type MessageData = {
  chat: string;
  createdAt: Timestamp;
  id: string;
  text: string;
  user: string;
  userId: string;
};

export default MessageData
