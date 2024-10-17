import UserData from "./UserData";

interface UserDocData extends UserData {
  email: string;
  friends: string[];
  invites: UserData[];
  lastSelectedChat: string | null;
}

export default UserDocData;
