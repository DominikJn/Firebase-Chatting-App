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
      className="bg-slate-600 rounded-full text-2xl cursor-pointer px-3 py-3 m-2 flex justify-between"
    >
      <p>
        {chat.chatName ? (
          <span>{chat.chatName}</span>
        ) : (
          chatMembers.map((member: UserData, index: number) => (
            <span key={index}>{member.name} </span>
          ))
        )}
      </p>
    </div>
  );
};

export default ChatShortcut;
