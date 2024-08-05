import React from "react";

interface ChatHeaderProps {
  chatName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName }) => {
  return (
    <div className=" bg-slate-900 text-white text-2xl p-3 flex justify-between relative">
      <span>{chatName}</span>
    </div>
  );
};

export default ChatHeader;
