import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import type MessageTypeField from "../types/message/MessageTypeField";
import ConfigMessageData from "../types/message/ConfigMesageData";
import NormalMessageData from "../types/message/NormalMessageData";

async function createMessageDoc(
  messageData: ConfigMessageData | NormalMessageData,
  type: MessageTypeField
): Promise<void> {
  const messagesRef = collection(db, "messages");
  await addDoc(messagesRef, { ...messageData, type });
}

export default createMessageDoc;
