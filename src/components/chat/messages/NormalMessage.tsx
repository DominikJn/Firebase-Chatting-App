import React from "react";
import type NormalMessageData from "../../../types/message/NormalMessageData";
import { userApi } from "../../../features/api/userApi";

interface NormalMessageProps {
  message: NormalMessageData;
}

const NormalMessage: React.FC<NormalMessageProps> = ({ message }) => {
  const user = userApi.endpoints.getUser.useQuery().data;
  const isCurrentUserMessage = message.userId === user?.id;

  return (
    <div
      className={`w-1/2 ${
        isCurrentUserMessage
          ? "bg-slate-800 text-white self-end"
          : "bg-gray-200"
      } text-xl px-4 py-8 rounded-lg shadow-lg break-all`}
    >
      {message.text}
    </div>
  );
};

export default NormalMessage;
