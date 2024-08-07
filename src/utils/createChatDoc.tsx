import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type UserData from "../types/UserData";
import { db } from "../firebase-config";
import type ChatData from "../types/ChatData";
import type ChatGroupType from "../types/ChatGroupType";
import createMessageDoc from "./createMessageDoc";
import ConfigMessageData from "../types/message/ConfigMesageData";

async function createChatDoc(
  users: UserData[],
  type: ChatGroupType
): Promise<void> {
  const userIds = users.map((user) => user.id);
  //create chat
  const chatDoc: ChatData = {
    userIds,
    users,
    chatName: "",
    type,
    lastMessage: "",
    lastMessageTimestamp: serverTimestamp(),
  };
  const chatDocRef = await addDoc(collection(db, "chats"), chatDoc);
  //create starting message
  const messageData: ConfigMessageData = {
    chat: chatDocRef.id,
    createdAt: serverTimestamp(),
    text: "Chat created!",
  };
  await createMessageDoc(messageData, "config");
}

export default createChatDoc;
