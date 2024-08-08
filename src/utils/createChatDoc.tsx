import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type UserData from "../types/UserData";
import { db } from "../firebase-config";
import type ChatData from "../types/chat/ChatData";
import type ChatGroupType from "../types/chat/ChatGroupType";
import createMessageDoc from "./createMessageDoc";
import ConfigMessageData from "../types/message/ConfigMesageData";

async function createChatDoc(
  users: UserData[],
  type: ChatGroupType
): Promise<void> {
  const userIds = users.map((user) => user.id);
  //set admins based on group type
  //if chat is single chat then both users will be admins
  //if chat is a group chat then only user that created the group will be admin (his index in array is always last)
  const admins = type === "group" ? [users[users.length - 1]?.id] : userIds;
  //create chat
  const chatDoc: ChatData = {
    userIds,
    users,
    admins,
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
