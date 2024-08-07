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

const Chat: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const chat = useSelector((state: RootState) => state.chats.value);
  const [areOptionsActive, setOptionsActive] = useState<boolean>(false);
  const chatRef = doc(db, "chats", chat.selectedChat);
  const dispatch = useDispatch();

  useEffect(() => {
    //check for chat changes like chatName change etc.
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const chatName = handleChatName(
        snapshot.data()?.chatName,
        snapshot.data()?.users
      );
      dispatch(setChatName(chatName));
    });

    return () => unsubscribe();
  }, [chat.selectedChat]);

  const toggleChatOptions = (): void => setOptionsActive(!areOptionsActive);

  async function sendMessage(message: string): Promise<void> {
    if (chat.selectedChat) {
      //add new message doc
      const messageData: NormalMessageData = {
        chat: chat.selectedChat,
        createdAt: serverTimestamp(),
        text: message,
        user: user.name,
        userId: user.uid,
      };
      await createMessageDoc(messageData, "normal");
      //update last message field in chat doc
      await updateDoc(chatRef, {
        lastMessage: message,
        lastMessageTimestamp: serverTimestamp(),
      });
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
        {areOptionsActive ? <ChatOptions chat={chat} /> : <MessageContainer />}
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
