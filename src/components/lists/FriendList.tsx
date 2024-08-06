import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { selectChat } from "../../features/chatsSlice";

type ChatToDeleteData = {
  id: string;
  userIds: string[];
};

const FriendList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const friends = useSelector((state: RootState) => state.friends.value);
  const chat = useSelector((state: RootState) => state.chats.value);
  const dispatch = useDispatch();

  async function handleFriendDelete(friend: UserData): Promise<void> {
    //update current users's profile
    await updateDoc(doc(db, "users", user.uid), {
      friends: arrayRemove(friend),
    });
    //update deleted friend's profile
    const userAdjustedData = { name: user.name, id: user.uid };
    await updateDoc(doc(db, "users", friend.id), {
      friends: arrayRemove(userAdjustedData),
    });
    //delete chat between users
    const chatRef = collection(db, "chats");
    const queryChats = query(
      chatRef,
      where("userIds", "array-contains", user.uid)
    );
    const chats: ChatToDeleteData[] = [];
    const chatDocs = await getDocs(queryChats);
    chatDocs.forEach((doc) =>
      chats.push({ id: doc.id, userIds: doc.data().userIds })
    );
    //find a chat that contains both friends ID and current user ID
    let chatToDelete: string = "";
    chats.forEach((chat) => {
      if (chat.userIds.includes(user.uid) && chat.userIds.includes(friend.id)) {
        chatToDelete = chat.id;
      }
    });
    await deleteDoc(doc(db, "chats", chatToDelete));
    //unselect the chat if it was with deleted friend
    if (chat.selectedChat === chatToDelete) dispatch(selectChat(""));
  }

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {friends.map((friend: UserData, index: number) => (
        <div
          key={`${friend.id}-${index}`}
          className="bg-slate-600 rounded-full text-2xl cursor-pointer px-3 py-3 m-2 flex flex-wrap justify-between gap-2"
        >
          <span>{friend.name}</span>
          <button onClick={() => handleFriendDelete(friend)}>x</button>
        </div>
      ))}
    </>
  );
};

export default FriendList;
