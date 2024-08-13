import { addDoc, collection } from "firebase/firestore";
import NormalMessageData from "../../types/message/NormalMessageData";
import ConfigMessageData from "../../types/message/ConfigMesageData";
import { db } from "../../firebase-config";

async function createMessageDoc(
  messageData: ConfigMessageData | NormalMessageData
): Promise<{ id: string }> {
  const messagesRef = collection(db, "messages");
  try {
    const docRef = await addDoc(messagesRef, messageData);
    return { id: docRef.id };
  } catch (error: any) {
    throw new Error(error);
  }
}

export default createMessageDoc;
