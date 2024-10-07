import React from "react";
import type ConfigMessageData from "../../../types/message/ConfigMesageData";
import { Timestamp } from "firebase/firestore";

interface ConfigMessageProps {
  message: ConfigMessageData;
}

const ConfigMessage: React.FC<ConfigMessageProps> = ({ message }) => {
  const timestamp: Timestamp = message.createdAt as Timestamp;

  const date =
    timestamp && new Date(timestamp.seconds * 1000).toLocaleDateString();
  const time =
    timestamp && new Date(timestamp.seconds * 1000).toLocaleTimeString();

  return (
    <div className="self-center flex flex-col items-center">
      <strong data-testid="datetime">
        {date} {time}
      </strong>
      <span className="text-gray-400">{message.text}</span>
    </div>
  );
};

export default ConfigMessage;
