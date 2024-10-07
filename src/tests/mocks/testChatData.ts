import { serverTimestamp } from "firebase/firestore";
import ChatData from "../../types/chat/ChatData";
import { testUsersArray } from "./testUsersArray";

const userIds: string[] = testUsersArray.map((user) => user.id);

export const testGroupChatData: ChatData = {
  id: "321",
  chatName: "Starks",
  userIds,
  users: testUsersArray,
  admins: userIds,
  unseenBy: ["1", "2", "3"],
  type: "group",
  lastMessage: "Winter is coming!",
  lastMessageTimestamp: serverTimestamp(),
};

export const testSingleChatData: ChatData = {
  id: "332211",
  chatName: "Weirdo",
  userIds: [testUsersArray[0].id, testUsersArray[1].id],
  users: [testUsersArray[0], testUsersArray[1]],
  admins: [testUsersArray[0].id, testUsersArray[1].id],
  unseenBy: ["1"],
  type: "single",
  lastMessage: "Wtf is wrong with you",
  lastMessageTimestamp: serverTimestamp(),
};
