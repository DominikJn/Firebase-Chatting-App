import React, { useEffect, useState } from "react";
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
import type NormalMessageData from "../../types/message/MessageData";

const MessageContainer: React.FC = () => {
  const chat = useSelector((state: RootState) => state.chats.value);
  const [messages, setMessages] = useState<NormalMessageData[]>([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chat", "==", chat.selectedChat),
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
  }, [chat.selectedChat]);

  return (
    <div className="h-full overflow-y-scroll flex flex-col gap-2 p-2">
      {messages.map((message: NormalMessageData, index: number) =>
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
