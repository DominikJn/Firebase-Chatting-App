import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, setChatName } from "../../features/chatsSlice";
import { RootState } from "../../store";
import type ChatData from "../../types/ChatData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import handleChatName from "../../utils/handleChatName";
import { HiUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

interface ChatShortcutProps {
  chat: ChatData;
}

const ChatShortcut: React.FC<ChatShortcutProps> = ({ chat }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const localChatName = handleChatName(chat.chatName, chat.users);
  const dispatch = useDispatch();
  console.log(chat.type);

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
      className="cursor-pointer px-2 py-2 border-solid border-b flex flex-wrap"
    >
      <div className="text-3xl flex items-center px-2 text-slate-700">
        {chat.type === "single" ? <CgProfile /> : <HiUserGroup />}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl">{localChatName}</span>
        <span className="text-slate-400 truncate">{chat.lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatShortcut;
