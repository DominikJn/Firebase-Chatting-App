import UserData from "./UserData";

interface UserDocData extends UserData {
  email: string;
  friends: UserData[];
  invites: UserData[];
  lastSelectedChat: string | null;
}

export default UserDocData;
