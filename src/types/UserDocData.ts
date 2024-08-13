import ChatData from "./chat/ChatData";
import UserData from "./UserData";

interface UserDocData extends UserData {
  id: string;
  email: string;
  friends: UserData[];
  invites: UserData[];
  unseenChats: string[];
  lastSelectedChat: ChatData;
}

export default UserDocData;
