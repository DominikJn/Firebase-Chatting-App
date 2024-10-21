import React, { useState } from "react";
import type NormalMessageData from "../../../types/message/NormalMessageData";
import { useGetUserQuery } from "../../../features/api/userApi";
import File from "../File";
import UserDocData from "../../../types/UserDocData";
import { MdModeEdit } from "react-icons/md";
import { useMessageEditor } from "../../context/MessageEditContext";

interface NormalMessageProps {
  message: NormalMessageData;
}

const NormalMessage: React.FC<NormalMessageProps> = ({ message }) => {
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const { editMessage } = useMessageEditor();

  const user = useGetUserQuery().data as UserDocData;
  const isCurrentUserMessage = message.userId === user.id;

  const showEdit = (): void => {
    if (isCurrentUserMessage) setEditVisible(true);
  };
  const hideEdit = (): void => {
    if (isCurrentUserMessage) setEditVisible(false);
  };

  return (
    <div
      className={`flex flex-col w-1/2 text-xl px-4 pt-4 pb-8 rounded-lg shadow-lg break-all relative ${
        isCurrentUserMessage
          ? "bg-slate-800 text-white self-end"
          : "bg-gray-200"
      }`}
      onMouseEnter={showEdit}
      onMouseLeave={hideEdit}
    >
      {!isCurrentUserMessage && (
        <h4 className="text-slate-400">{message.user}</h4>
      )}
      {message.isEdited && (
        <span className="text-slate-500 text-sm">Edited</span>
      )}
      {message.file && <File file={message.file} />}
      <span>{message.text}</span>
      <div className="absolute bottom-1 left-1">
        {editVisible && (
          <MdModeEdit
            className="text-slate-400 hover:text-white hover:cursor-pointer"
            onClick={() => editMessage(message)}
          />
        )}
      </div>
    </div>
  );
};

export default NormalMessage;
