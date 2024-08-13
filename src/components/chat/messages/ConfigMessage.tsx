import React from "react";
import type ConfigMessageData from "../../../types/message/ConfigMesageData";
import { Timestamp } from "firebase/firestore";

interface ConfigMessageProps {
  message: ConfigMessageData;
}

const ConfigMessage: React.FC<ConfigMessageProps> = ({ message }) => {
  const timestamp: Timestamp = message.createdAt as Timestamp;
  const date = new Date(timestamp.seconds * 1000).toLocaleDateString();
  const time = new Date(timestamp.seconds * 1000).toLocaleTimeString();

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
