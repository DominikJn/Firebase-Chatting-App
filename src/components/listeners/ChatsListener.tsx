import React, { useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type ChatData from "../../types/chat/ChatData";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../features/chatsSlice";
import { db } from "../../firebase-config";
import { RootState } from "../../store";

const ChatsListener: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const chatRef = collection(db, "chats");
    const queryChats = query(
      chatRef,
      where("userIds", "array-contains", user.uid),
      orderBy("lastMessageTimestamp", "desc")
    );
    const unsub = onSnapshot(queryChats, (snapshot) => {
      const fetchedChats: ChatData[] = [];
      snapshot.forEach((doc) => {
        const data: ChatData = { id: doc.id, ...doc.data() };
        fetchedChats.push(data);
      });
      dispatch(setChats(fetchedChats));
    });

    return () => unsub();
  }, []);
  return null;
};

export default ChatsListener;
