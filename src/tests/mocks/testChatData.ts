import { serverTimestamp } from "firebase/firestore";
import ChatData from "../../types/chat/ChatData";
import { testUsersArray } from "./testUsersArray";

const users: string[] = testUsersArray.map((user) => user.id);

export const testGroupChatData: ChatData = {
  id: "321",
  chatName: "Starks",
  users,
  admins: users,
  unseenBy: ["1", "2", "3"],
  type: "group",
  lastMessage: "Winter is coming!",
  lastMessageTimestamp: serverTimestamp(),
};

export const testSingleChatData: ChatData = {
  id: "332211",
  chatName: "Weirdo",
  users: [users[0], users[1]],
  admins: [users[0], users[1]],
  unseenBy: ["1"],
  type: "single",
  lastMessage: "Wtf is wrong with you",
  lastMessageTimestamp: serverTimestamp(),
};
