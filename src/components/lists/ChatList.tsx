import React, { useEffect, useState } from "react";
import ListStyleTemplate from "./ListStyleTemplate";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import ChatShortcut from "./ChatShortcut";
import ChatData from "../../types/ChatData";

const ChatList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [chats, setChats] = useState<ChatData[]>([]);
  const chatsRef = collection(db, "chats");

  useEffect(() => {
    const queryRooms = query(
      chatsRef,
      where("userIds", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      const fetchedChats: ChatData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        users: doc.data().users,
      }));
      console.log(fetchedChats);
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user.uid]);
  return (
    <ListStyleTemplate>
      <h2 className="text-center text-2xl">Chats</h2>
      {chats.map((chat, index) => (
        <ChatShortcut key={`${index}`} chat={chat} />
      ))}
    </ListStyleTemplate>
  );
};

export default ChatList;
