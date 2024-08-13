import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase-config";
import type ChatData from "../../types/chat/ChatData";
import createMessageDoc from "./createMessageDoc";
import ConfigMessageData from "../../types/message/ConfigMesageData";

async function createChatDoc(newChat: ChatData): Promise<{ id: string }> {
  try {
    //create chat
    const chatDocRef = await addDoc(collection(db, "chats"), newChat);
    //create starting message
    const messageData: ConfigMessageData = {
      chat: chatDocRef.id,
      createdAt: serverTimestamp(),
      type: "config",
      text: "Chat created!",
    };
    await createMessageDoc(messageData);

    return { id: chatDocRef.id };
  } catch (error: any) {
    throw new Error(error);
  }
}

export default createChatDoc;
