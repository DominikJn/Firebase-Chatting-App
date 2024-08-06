import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";

interface ChatHeaderProps {
  chatName: string;
  areOptionsActive: boolean;
  toggleChatOptions: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  areOptionsActive,
  toggleChatOptions,
}) => {
  return (
    <div className=" bg-slate-900 text-white text-2xl p-3 flex justify-between relative">
      <span>{chatName}</span>
      <button onClick={toggleChatOptions}>
        {areOptionsActive ? <IoMdArrowBack /> : <IoSettingsOutline />}
      </button>
    </div>
  );
};

export default ChatHeader;
