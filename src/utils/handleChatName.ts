import type UserData from "../types/UserData";

function handleChatName(chatName: string, users: UserData[]): string {
  const alternativeChatname = users.map((user) => user.name).join(", ");
  if (!chatName) return alternativeChatname;

  return chatName;
}

export default handleChatName;
