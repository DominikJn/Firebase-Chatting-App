import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import ChatShortcut from "./ChatShortcut";
import CreateGroupModal from "../modals/CreateGroupModal";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import type ChatData from "../../types/ChatData";
import { setChats } from "../../features/chatsSlice";

const ChatList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const chats = useSelector((state: RootState) => state.chats.value.chats);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const chatRef = collection(db, "chats");
    const queryChats = query(
      chatRef,
      where("userIds", "array-contains", user.uid),
      orderBy("lastMessageTimestamp", 'desc')
    );
    const unsub = onSnapshot(queryChats, (snapshot) => {
      const fetchedChats: ChatData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedChats.push({
          id: doc.id,
          users: data.users,
          chatName: data.chatName,
          lastMessage: data.lastMessage,
          lastMessageTimestamp: data.lastMessageTimestamp,
        });
      });
      dispatch(setChats(fetchedChats));
    });

    return () => unsub();
  }, []);

  return (
    <>
      <h2 className="text-center text-2xl">Chats</h2>
      <div className="text-center text-gray-400">
        {isModalOpen && <CreateGroupModal setModalOpen={setModalOpen} />}
        <button
          onClick={() => setModalOpen(true)}
          className="hover:text-white duration-75"
        >
          Create New Chat
        </button>
      </div>
      {chats.map((chat, index) => (
        <ChatShortcut key={`${index}`} chat={chat} />
      ))}
    </>
  );
};

export default ChatList;
