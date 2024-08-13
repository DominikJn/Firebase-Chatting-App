import { FieldValue, Timestamp } from "firebase/firestore";
import type MessageTypeField from './MessageTypeField'

type MessageData = {
  id?: string;
  chat: string;
  createdAt: Timestamp | FieldValue;
  type: MessageTypeField;
  text: string;
};

export default MessageData;
