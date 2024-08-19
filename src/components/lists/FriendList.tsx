import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { selectChat } from "../../features/selectedChatSlice";
import { useGetUserQuery } from "../../features/api/userApi";
import {
  useDeleteChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";

const FriendList: React.FC = () => {
  const user = useGetUserQuery().data;
  const chats = useGetUserChatsQuery().data;
  const [deleteChat] = useDeleteChatMutation();

  const selectedChat = useSelector(
    (state: RootState) => state.selectedChat.value
  );
  const dispatch = useDispatch();

  async function handleFriendDelete(friend: UserData): Promise<void> {
    if (user) {
      const chatId =
        chats?.filter(
          (chat) => chat.userIds.includes(friend.id) && chat.type === "single"
        )[0].id || "";
      // update current users's profile
      await updateDoc(doc(db, "users", user.id), {
        friends: arrayRemove(friend),
        unseenChats: arrayRemove(chatId),
        lastSelectedChat: null,
      });
      //update deleted friend's profile
      await updateDoc(doc(db, "users", friend.id), {
        friends: arrayRemove({ name: user.name, id: user.id }),
        unseenChats: arrayRemove(chatId),
        lastSelectedChat: null,
      });
      //delete chat between users
      deleteChat(chatId).unwrap();
      //unselect the chat if it was with deleted friend
      if (selectedChat?.id === chatId) dispatch(selectChat(null));
    }
  }

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {user?.friends.map((friend: UserData, index: number) => (
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
