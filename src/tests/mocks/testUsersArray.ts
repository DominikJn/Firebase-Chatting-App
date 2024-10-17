import { serverTimestamp } from "firebase/firestore";
import UserData from "../../types/UserData";

export const testUsersArray: UserData[] = [
  {
    name: "Jon",
    id: "1",
    status: {
      isActive: true,
      lastOnline: null,
    },
  },
  {
    name: "Arya",
    id: "2",
    status: {
      isActive: true,
      lastOnline: null,
    },
  },
  {
    name: "Robb",
    id: "3",
    status: {
      isActive: true,
      lastOnline: null,
    },
  },
  {
    name: "Sansa",
    id: "4",
    status: {
      isActive: false,
      lastOnline: serverTimestamp(),
    },
  },
  {
    name: "Bran",
    id: "5",
    status: {
      isActive: false,
      lastOnline: serverTimestamp(),
    },
  },
  {
    name: "Rickon",
    id: "6",
    status: {
      isActive: false,
      lastOnline: serverTimestamp(),
    },
  },
];
