import { FieldValue, Timestamp } from "firebase/firestore";
import type MessageTypeField from './MessageTypeField'

type MessageData = {
  chat: string;
  createdAt: Timestamp | FieldValue;
  id: string;
  type: MessageTypeField;
  text: string;
};

export default MessageData;
