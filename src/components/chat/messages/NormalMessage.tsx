import React, { useState } from "react";
import type NormalMessageData from "../../../types/message/NormalMessageData";
import { useGetUserQuery } from "../../../features/api/userApi";
import File from "../File";
import UserDocData from "../../../types/UserDocData";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useMessageEditor } from "../../context/MessageEditContext";
import {
  useDeleteFileMutation,
  useDeleteMessageMutation,
} from "../../../features/api/messageApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import extractFirestoreFilePathFromUrl from "../../../utils/extractFirestoreFilePathFromUrl";

interface NormalMessageProps {
  message: NormalMessageData;
}

const NormalMessage: React.FC<NormalMessageProps> = ({ message }) => {
  const [iconsVisible, setIconsVisible] = useState<boolean>(false);
  const { editMessage } = useMessageEditor();

  const user = useGetUserQuery().data as UserDocData;
  const [deleteMessage] = useDeleteMessageMutation();
  const [deleteFile] = useDeleteFileMutation();
  const selectedChatId =
    useSelector((state: RootState) => state.selectedChatId.value) || "";

  const isCurrentUserMessage = message.userId === user.id;

  const showEdit = (): void => {
    if (isCurrentUserMessage) setIconsVisible(true);
  };
  const hideEdit = (): void => {
    if (isCurrentUserMessage) setIconsVisible(false);
  };

  const handleMessageDelete = () => {
    //delete message doc
    deleteMessage({
      chatId: selectedChatId,
      messageId: message.id,
    });
    //delete file from firebase storage if message contains its url
    if (message.file?.url)
      deleteFile(extractFirestoreFilePathFromUrl(message.file.url));
  };

  return (
    <div
      data-testid="message"
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
      <div className="absolute bottom-1 left-1 flex gap-2">
        {iconsVisible && (
          <>
            <MdModeEdit
              className="text-slate-400 hover:text-white hover:cursor-pointer duration-100"
              onClick={() => editMessage(message)}
            />
            <MdDelete
              data-testid={`delete-message-${message.id}`}
              className="text-slate-400 hover:text-red-700 hover:cursor-pointer duration-100"
              onClick={() => handleMessageDelete()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NormalMessage;
