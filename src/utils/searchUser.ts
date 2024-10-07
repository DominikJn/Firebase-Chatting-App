import {
  collection,
  endAt,
  getDocs,
  orderBy,
  startAt,
  query,
} from "firebase/firestore";
import { db } from "../firebase-config";
import UserData from "../types/UserData";

export default async function searchUser(value: string): Promise<UserData[]> {
  try {
    const userRef = collection(db, "users");
    const q = query(
      userRef,
      orderBy("name"),
      startAt(value),
      endAt(value + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const fetchedUsers: UserData[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return fetchedUsers;
  } catch (error: any) {
    throw new Error(error);
  }
}
