import React, { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase-config";
import { RootState } from "../../store";
import MessageForm from "./MessageForm";
import MessageContainer from "./MessageContainer";
import ChatHeader from "./ChatHeader";
import { setChatName } from "../../features/chatsSlice";
import handleChatName from "../../utils/handleChatName";
import ChatOptions from "./ChatOptions";
import createMessageDoc from "../../utils/createMessageDoc";
import type NormalMessageData from "../../types/message/NormalMessageData";
import updateUsersUnseenChats from "../../utils/updateUsersUnseenChats";

const Chat: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const chat = useSelector((state: RootState) => state.chats.value);
  const [areOptionsActive, setOptionsActive] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (chat.selectedChat) {
      //check for chat changes like chatName change etc.
      const chatRef = doc(db, "chats", chat.selectedChat.id);
      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const chatName = handleChatName(
            snapshot.data()?.chatName,
            snapshot.data()?.users
          );
          dispatch(setChatName(chatName));
        }
      });

      return () => unsubscribe();
    }
  }, [chat.selectedChat]);

  const toggleChatOptions = (): void => setOptionsActive(!areOptionsActive);

  async function sendMessage(message: string): Promise<void> {
    if (chat.selectedChat) {
      const selectedChat = chat.selectedChat;
      //add new message doc
      const messageData: NormalMessageData = {
        chat: selectedChat.id,
        createdAt: serverTimestamp(),
        text: message,
        user: user.name,
        userId: user.uid,
      };
      await createMessageDoc(messageData, "normal");
      //update last message field in chat doc
      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, {
        lastMessage: message,
        lastMessageTimestamp: serverTimestamp(),
      });
      //update unseen chats array in all of chat members user docs
      const usersWithoutCurrentUser = selectedChat.users.filter(
        (chatUser) => chatUser.id !== user.uid
      );
      await updateUsersUnseenChats(usersWithoutCurrentUser, selectedChat.id);
    }
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-100 w-full h-full flex flex-col">
        <ChatHeader
          chatName={chat.chatName}
          areOptionsActive={areOptionsActive}
          toggleChatOptions={toggleChatOptions}
        />
        {areOptionsActive ? (
          <>{chat.selectedChat && <ChatOptions chat={chat.selectedChat} />}</>
        ) : (
          <MessageContainer />
        )}
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
