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
} from "../../features/api/messageApi";
import handleChatName from "../../utils/handleChatName";
import { useGetUserQuery } from "../../features/api/userApi";

const Chat: React.FC = () => {
  const [areOptionsActive, setOptionsActive] = useState<boolean>(false);
  const user = useGetUserQuery().data;
  const selectedChat = useSelector(
    (state: RootState) => state.selectedChat.value
  );
  const chatName: string =
    selectedChat && handleChatName(selectedChat.chatName, selectedChat.users);

  const [sendMessage] = useSendMessageMutation();
  const [updateUnseenBy] = useUpdateUnseenByMutation();

  const toggleChatOptions = (): void => setOptionsActive(!areOptionsActive);

  async function handleMessageFormSubmit(message: string): Promise<void> {
    if (user && selectedChat) {
      //add new message doc
      const chatId = selectedChat.id || "";
      const messageData: NormalMessageData = {
        createdAt: serverTimestamp(),
        text: message,
        type: "normal",
        user: user.name,
        userId: user.id,
      };
      sendMessage({ message: messageData, chatId: selectedChat.id });
      //update unseenChats array in users' docs
      const userIds: string[] = selectedChat.userIds.filter(
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
