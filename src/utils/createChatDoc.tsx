import { addDoc, collection } from "firebase/firestore";
import type UserData from "../types/UserData";
import { db } from "../firebase-config";

async function createChatDoc(users: UserData[]): Promise<void> {
  const userIds = users.map((user) => user.id);
  await addDoc(collection(db, "chats"), {
    userIds: userIds,
    users: users,
  });
}

export default createChatDoc;
