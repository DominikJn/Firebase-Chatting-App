import { auth } from "../firebase-config";
import type ChatGroupType from "../types/chat/ChatGroupType";
import type UserData from "../types/UserData";

function handleChatName(
  chatName: string | null,
  users: UserData[],
  chatType: ChatGroupType
): string {
  if (!chatName) {
    if (chatType === "group") {
      return users.map((user) => user.name).join(", ");
    } else {
      const currentUserId = auth.currentUser?.uid || "";
      return users
        .filter((user) => user.id !== currentUserId)
        .map((user) => user.name)
        .join(", ");
    }
  } else {
    return chatName;
  }
}

export default handleChatName;
