import React from "react";
import type NormalMessageData from "../../../types/message/NormalMessageData";
import { useGetUserQuery } from "../../../features/api/userApi";
import File from "../File";
import UserDocData from "../../../types/UserDocData";

interface NormalMessageProps {
  message: NormalMessageData;
}

const NormalMessage: React.FC<NormalMessageProps> = ({ message }) => {
  const user = useGetUserQuery().data as UserDocData;
  const isCurrentUserMessage = message.userId === user.id;

  return (
    <div
      className={`w-1/2 text-xl px-4 pt-4 pb-8 rounded-lg shadow-lg break-all ${
        isCurrentUserMessage
          ? "bg-slate-800 text-white self-end"
          : "bg-gray-200"
      }`}
    >
      {!isCurrentUserMessage && (
        <h4 className="text-slate-400">{message.user}</h4>
      )}
      {message.file && <File file={message.file} />}
      {message.text}
    </div>
  );
};

export default NormalMessage;
