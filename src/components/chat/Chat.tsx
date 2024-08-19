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

const Chat: React.FC = () => {
  const [areOptionsActive, setOptionsActive] = useState<boolean>(false);
  const user = useGetUserQuery().data;
  const selectedChat = useSelector(
    (state: RootState) => state.selectedChat.value
  );
  const chatName: string =
    selectedChat && handleChatName(selectedChat.chatName, selectedChat.users);

  const [sendMessage] = useSendMessageMutation();
  const [uploadFile] = useUploadFileMutation();
  const [updateUnseenBy] = useUpdateUnseenByMutation();

  const toggleChatOptions = (): void => setOptionsActive(!areOptionsActive);

  async function handleMessageFormSubmit(
    message: string,
    file: File
  ): Promise<void> {
    if (user) {
      const chatId = selectedChat?.id || "";
      //upload file to firebase storage and return its URL
      const fileUrl =
        file &&
        (await uploadFile({ path: `files/${chatId}/${v4()}`, file })).data;
      //add new message doc
      const messageData: NormalMessageData = {
        createdAt: serverTimestamp(),
        text: message,
        type: "normal",
        user: user.name,
        userId: user.id,
        ...(file && { fileUrl }),
      };
      sendMessage({ message: messageData, chatId });
      //update unseenBy in chat doc
      const chatUserIds: string[] = selectedChat?.userIds || [];
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
          <>{selectedChat && <ChatOptions chat={selectedChat} />}</>
        ) : (
          <MessageContainer />
        )}
        <MessageForm handleMessageFormSubmit={handleMessageFormSubmit} />
      </div>
    </article>
  );
};

export default Chat;
