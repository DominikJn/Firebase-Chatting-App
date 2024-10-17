import UserData from "../types/UserData";

export default function getUserIds(users: UserData[]): string[] {
  return users.map((user) => user.id);
}
