import { arrayUnion, doc, writeBatch } from "firebase/firestore";
import type UserData from "../types/UserData";
import { db } from "../firebase-config";

async function updateUsersUnseenChats(
  users: UserData[],
  chatId: string
): Promise<void> {
  const batch = writeBatch(db);
  users.forEach((user) => {
    const docRef = doc(db, "users", user.id);
    batch.update(docRef, { unseenChats: arrayUnion(chatId) });
  });

  try {
    await batch.commit();
    console.log("Batch update successful");
  } catch (error: any) {
    console.error("Batch update failed: ", error);
  }
}

export default updateUsersUnseenChats;
