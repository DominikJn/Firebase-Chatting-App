import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type UserData from "../types/UserData";
import { db } from "../firebase-config";
import type ChatData from "../types/ChatData";
import type ChatGroupType from "../types/ChatGroupType";

async function createChatDoc(
  users: UserData[],
  type: ChatGroupType
): Promise<void> {
  const userIds = users.map((user) => user.id);
  const chatDoc: ChatData = {
    userIds,
    users,
    chatName: '',
    type,
    lastMessage: "",
    lastMessageTimestamp: serverTimestamp(),
  };
  await addDoc(collection(db, "chats"), chatDoc);
}

export default createChatDoc;
