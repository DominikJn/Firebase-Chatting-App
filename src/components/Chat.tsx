import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
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
import { db } from "../firebase-config";
import { RootState } from "../store";
import type MessageData from "../types/MessageData";
import Message from "./Message";

const Chat: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const chat = useSelector(
    (state: RootState) => state.chats.value.selectedChat
  );
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chat", "==", chat),
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
  }, [chat]);

  async function sendMessage(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (chat) {
      await addDoc(messagesRef, {
        chat,
        createdAt: serverTimestamp(),
        text: message,
        user: user.name,
        userId: user.uid,
      });
      setMessage("");
    }
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-100 w-full h-full flex flex-col">
        {chat ? (
          <>
            <div className=" bg-slate-900 text-white text-2xl p-3">
              Friend's name
            </div>
            <div className="h-full overflow-y-scroll flex flex-col gap-2 p-2">
              {messages.map((message: MessageData, index: number) => (
                <Message key={index} message={message} />
              ))}
            </div>
            <form
              onSubmit={(e) => sendMessage(e)}
              className="bg-slate-900 p-2 flex justify-between items-center gap-6"
            >
              <input
                type="text"
                placeholder="Write a message..."
                className="w-full h-full py-3 px-6 text-2xl rounded-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="text-white text-4xl">
                <IoSend />
              </button>
            </form>
          </>
        ) : (
          <h2 className="text-center text-gray-500 text-2xl">
            No chat selected
          </h2>
        )}
      </div>
    </div>
  );
};

export default Chat;
