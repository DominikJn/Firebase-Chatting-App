import UserData from "./UserData";

interface UserDocData extends UserData {
  id: string;
  email: string;
  friends: UserData[];
  invites: UserData[];
  lastSelectedChat: string | null;
}

export default UserDocData;
