import React, { useEffect, useRef, useState } from "react";
import NormalMessage from "./messages/NormalMessage";
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
import ConfigMessage from "./messages/ConfigMessage";
import type NormalMessageData from "../../types/message/NormalMessageData";

const MessageContainer: React.FC = () => {
  const chat = useSelector((state: RootState) => state.chats.value);
  const [messages, setMessages] = useState<NormalMessageData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    scrollDown();
  }, [messages]);

  useEffect(() => {
    if (chat.selectedChat) {
      const queryMessages = query(
        messagesRef,
        where("chat", "==", chat.selectedChat.id),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const fetchedMessages: NormalMessageData[] = [];
        snapshot.forEach((doc) => {
          const data: NormalMessageData = { id: doc.id, ...doc.data() };
          fetchedMessages.push(data);
        });
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [chat.selectedChat]);

  function scrollDown(): void {
    const current = containerRef.current;
    if (current) current.scrollTop = current.scrollHeight;
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll flex flex-col gap-2 p-2"
    >
      {messages.map((message, index) =>
        message.type === "normal" ? (
          <NormalMessage key={index} message={message} />
        ) : (
          <ConfigMessage key={index} message={message} />
        )
      )}
    </div>
  );
};

export default MessageContainer;
