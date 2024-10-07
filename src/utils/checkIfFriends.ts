import UserDocData from "../types/UserDocData";

export default function checkIfFriends(
  user: UserDocData,
  searchedUserId: string
): boolean {
  //prevent user from inviting himself
  if (searchedUserId === user.id) return true;

  for (let friend of user.friends) {
    if (searchedUserId === friend.id) return true;
  }

  return false;
}
