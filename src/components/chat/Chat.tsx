import React, { useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebase-config";
import { RootState } from "../../store";
import MessageForm from "./MessageForm";
import MessageContainer from "./MessageContainer";
import ChatHeader from "./ChatHeader";
import ChatOptions from "./ChatOptions";
import type NormalMessageData from "../../types/message/NormalMessageData";
import {
  useSendMessageMutation,
  useUpdateUnseenByMutation,
  useUploadFileMutation,
} from "../../features/api/messageApi";
import handleChatName from "../../utils/handleChatName";
import { useGetUserQuery } from "../../features/api/userApi";
import { v4 } from "uuid";
import { useGetChatByIdQuery } from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";

type UploadedFileData = {
  data: { type: string; url: string };
};

const Chat: React.FC = () => {
  const [areOptionsActive, setOptionsActive] = useState<boolean>(false);

  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  const user = useGetUserQuery().data as UserDocData;
  const chat = useGetChatByIdQuery(selectedChatId || "").data;

  const [sendMessage] = useSendMessageMutation();
  const [uploadFile] = useUploadFileMutation();
  const [updateUnseenBy] = useUpdateUnseenByMutation();

  const chatName = chat ? handleChatName(chat?.chatName, chat.users) : "";

  const toggleChatOptions = (): void => setOptionsActive(!areOptionsActive);

  async function handleMessageFormSubmit(
    message: string,
    file: File
  ): Promise<void> {
    const chatId = chat?.id || "";
    //upload file to firebase storage and return its URL
    const uploadedFile =
      file &&
      ((await uploadFile({
        path: `files/${chatId}/${v4()}`,
        file,
      })) as UploadedFileData);
    //add new message doc
    const messageData: NormalMessageData = {
      createdAt: serverTimestamp(),
      text: message,
      type: "normal",
      user: user.name,
      userId: user.id,
      ...(file && { file: { ...uploadedFile.data } }),
    };
    sendMessage({ message: messageData, chatId });
    //update unseenBy in chat doc
    const chatUserIds: string[] = chat?.userIds || [];
    const userIds: string[] = chatUserIds.filter(
      (userId) => userId !== user.id
    );
    updateUnseenBy({ userIds, chatId });
    //update last message field in chat doc
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: message,
      lastMessageTimestamp: serverTimestamp(),
    });
  }

  return (
    <article className="w-full p-4">
      <div className="bg-gray-100 w-full h-full flex flex-col">
        <ChatHeader
          chatName={chatName}
          areOptionsActive={areOptionsActive}
          toggleChatOptions={toggleChatOptions}
        />
        {areOptionsActive ? (
          <>{chat && <ChatOptions chat={chat} />}</>
        ) : (
          <MessageContainer />
        )}
        <MessageForm handleMessageFormSubmit={handleMessageFormSubmit} />
      </div>
    </article>
  );
};

export default Chat;
