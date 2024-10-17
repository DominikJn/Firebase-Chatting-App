import { serverTimestamp } from "firebase/firestore";
import UserDocData from "../../types/UserDocData";

export const testUserDocData: UserDocData = {
  id: "1",
  name: "Jon Snow",
  email: "jon.snow@winterfell.com",
  friends: ["1", "2", "4"],
  invites: [
    { name: "Allister Thorn", id: "69" },
    { name: "Janos Slynt", id: "70" },
  ],
  status: { isActive: false, lastOnline: serverTimestamp() },
  lastSelectedChat: null,
};
