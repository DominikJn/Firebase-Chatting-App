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
    <section className="h-[60px] bg-slate-900 text-white text-2xl p-3 flex justify-between relative">
      <div>
        <span>{chatName}</span>
      </div>
      <button onClick={toggleChatOptions}>
        {areOptionsActive ? (
          <IoMdArrowBack data-testid="back" />
        ) : (
          <IoSettingsOutline data-testid="settings" />
        )}
      </button>
    </section>
  );
};

export default ChatHeader;
