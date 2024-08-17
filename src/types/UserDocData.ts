import ChatData from "./chat/ChatData";
import UserData from "./UserData";

interface UserDocData extends UserData {
  id: string;
  email: string;
  friends: UserData[];
  invites: UserData[];
  lastSelectedChat: ChatData | null;
}

export default UserDocData;
