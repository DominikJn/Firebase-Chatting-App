import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, setChatName } from "../../features/chatsSlice";
import { RootState } from "../../store";
import type ChatData from "../../types/ChatData";
import UserData from "../../types/UserData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import handleChatName from "../../utils/handleChatName";

interface ChatShortcutProps {
  chat: ChatData;
}

const ChatShortcut: React.FC<ChatShortcutProps> = ({ chat }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();
  const chatMembers = chat.users.filter(
    (memmber: UserData) => memmber.name !== user.name
  );

  async function handleClick(): Promise<void> {
    const docRef = doc(db, "users", user.uid);
    dispatch(selectChat(chat.id));
    //set chatName
    const chatName = handleChatName(chat.chatName, chat.users);
    dispatch(setChatName(chatName));
    //update last selected chat id in user doc
    await updateDoc(docRef, { lastSelectedChat: chat.id });
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer px-2 py-2 border-solid border-b flex flex-col"
    >
      <p className="text-2xl">
        {chat.chatName ? (
          <span>{chat.chatName}</span>
        ) : (
          chatMembers.map((member: UserData, index: number) => (
            <span key={index}>{member.name} </span>
          ))
        )}
      </p>
      <span className="text-slate-400 truncate">{chat.lastMessage}</span>
    </div>
  );
};

export default ChatShortcut;
