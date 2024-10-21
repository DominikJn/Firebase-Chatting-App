import { serverTimestamp } from "firebase/firestore";
import ConfigMessageData from "../../types/message/ConfigMesageData";
import NormalMessageData from "../../types/message/NormalMessageData";

export const testMessages: (ConfigMessageData | NormalMessageData)[] = [
  {
    createdAt: serverTimestamp(),
    text: "test message",
    type: "config",
  },
  {
    createdAt: serverTimestamp(),
    text: "Hi Jon!",
    type: "normal",
    user: "Jon Snow",
    userId: "1",
  },
  {
    createdAt: serverTimestamp(),
    text: "Hi Robb!",
    type: "normal",
    user: "Robb Stark",
    userId: "2",
  },
];

export const spammedTestMessages: NormalMessageData[] = [
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
  {
    id: "randomMessageId",
    createdAt: serverTimestamp(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "normal",
    user: "BloodRaven",
    userId: "XXXXXXXXXXX",
  },
];
