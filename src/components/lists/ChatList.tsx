import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import ChatShortcut from "./ChatShortcut";
import ChatData from "../../types/ChatData";
import CreateGroupModal from "../modals/CreateGroupModal";

const ChatList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const chatsRef = collection(db, "chats");

  useEffect(() => {
    const queryChats = query(
      chatsRef,
      where("userIds", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(queryChats, (snapshot) => {
      const fetchedChats: ChatData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        users: doc.data().users,
        chatName: doc.data().chatName,
      }));
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <>
      <h2 className="text-center text-2xl">Chats</h2>
      <div className="text-center text-gray-400">
        {isModalOpen && <CreateGroupModal setModalOpen={setModalOpen} />}
        <button onClick={() => setModalOpen(true)} className="hover:text-white duration-75">Create New Chat</button>
      </div>
      {chats.map((chat, index) => (
        <ChatShortcut key={`${index}`} chat={chat} />
      ))}
    </>
  );
};

export default ChatList;
