import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase-config";
import { RootState } from "../../store";
import MessageForm from "./MessageForm";
import MessageContainer from "./MessageContainer";
import ChatHeader from "./ChatHeader";
import { setChatName } from "../../features/chatsSlice";

const Chat: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const chat = useSelector((state: RootState) => state.chats.value);
  const messagesRef = collection(db, "messages");
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchChatName(): Promise<void> {
      const docSnap = await getDoc(doc(db, "chats", chat.selectedChat));
      const chatName: string = docSnap.data()?.chatName || "";
      if (chatName) dispatch(setChatName(chatName));
    }

    fetchChatName();
  }, [chat.selectedChat]);

  async function sendMessage(message: string): Promise<void> {
    if (chat.selectedChat) {
      await addDoc(messagesRef, {
        chat: chat.selectedChat,
        createdAt: serverTimestamp(),
        text: message,
        user: user.name,
        userId: user.uid,
      });
    }
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-100 w-full h-full flex flex-col">
        <ChatHeader chatName={chat.chatName} />
        <MessageContainer />
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
