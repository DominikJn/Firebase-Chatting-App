import type UserData from "../types/UserData";

function handleChatName(chatName: string | null, users: UserData[]): string {
  const alternativeChatname = users.map((user) => user.name).join(", ");
  //if chat name is not provided, use the list of user names as chat name
  if (!chatName) return alternativeChatname;

  return chatName;
}

export default handleChatName;
