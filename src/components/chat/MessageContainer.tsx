import React, { useEffect, useState } from "react";
import type MessageData from "../../types/MessageData";
import Message from "../Message";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
  } from "firebase/firestore";
import { db } from "../../firebase-config";

const MessageContainer: React.FC = () => {
  const chat = useSelector((state: RootState) => state.chats.value);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chat", "==", chat.selectedChat),
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
  }, [chat.selectedChat]);

  return (
    <div className="h-full overflow-y-scroll flex flex-col gap-2 p-2">
      {messages.map((message: MessageData, index: number) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageContainer;
