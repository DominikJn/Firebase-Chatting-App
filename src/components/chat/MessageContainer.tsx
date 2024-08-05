import React from "react";
import type MessageData from "../../types/MessageData";
import Message from "../Message";

interface MessageContainerProps {
  messages: MessageData[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages }) => {
  return (
    <div className="h-full overflow-y-scroll flex flex-col gap-2 p-2">
      {messages.map((message: MessageData, index: number) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageContainer;
