import React from "react";
import type ConfigMessageData from "../../../types/message/MessageData";

interface ConfigMessageProps {
  message: ConfigMessageData;
}

const ConfigMessage: React.FC<ConfigMessageProps> = ({ message }) => {
  const date = new Date(message.createdAt.seconds * 1000).toLocaleDateString();
  const time = new Date(message.createdAt.seconds * 1000).toLocaleTimeString();
  return (
    <div className="self-center flex flex-col items-center">
      <strong>
        {date} {time}
      </strong>
      <span className="text-gray-400">{message.text}</span>
    </div>
  );
};

export default ConfigMessage;
