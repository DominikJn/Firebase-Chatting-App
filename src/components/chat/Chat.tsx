import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebase-config";
import { RootState } from "../../store";
import type MessageData from "../../types/MessageData";
import MessageForm from "./MessageForm";
import MessageContainer from "./MessageContainer";
import ChatHeader from "./ChatHeader";

const Chat: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const selectedChat = useSelector(
    (state: RootState) => state.chats.value.selectedChat
  );
  const [messages, setMessages] = useState<MessageData[]>([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chat", "==", selectedChat),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const fetchedMessages: MessageData[] = [];
      snapshot.forEach((doc) =>
        fetchedMessages.push({
          id: doc.id,
          chat: doc.data().chat,
          createdAt: doc.data().createdAt,
          text: doc.data().text,
          user: doc.data().user,
          userId: doc.data().userId,
        })
      );
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  async function sendMessage(message: string): Promise<void> {
    if (selectedChat) {
      await addDoc(messagesRef, {
        chat: selectedChat,
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
        <ChatHeader />
        <MessageContainer messages={messages} />
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
