import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from "../../features/chatsSlice";
import { RootState } from "../../store";
import type ChatData from "../../types/ChatData";
import UserData from "../../types/UserData";

interface ChatShortcutProps {
  chat: ChatData
}

const ChatShortcut: React.FC<ChatShortcutProps> = ({ chat }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();
  const chatMembers = chat.users.filter(
    (memmber: UserData) => memmber.name !== user.name
  );

  return (
    <div
      onClick={() => dispatch(selectChat(chat.id))}
      className="bg-slate-600 rounded-full text-2xl cursor-pointer px-6 py-3 m-2 flex justify-between"
    >
      <p>
        {chatMembers.map((member: UserData, index: number) => (
          <span key={index}>{member.name} </span>
        ))}
      </p>
    </div>
  );
};

export default ChatShortcut;
