import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { selectChatId } from "../../features/selectedChatIdSlice";
import {
  useDeleteFriendMutation,
  useGetUserQuery,
} from "../../features/api/userApi";
import {
  useDeleteChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";

const FriendList: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const chats = useGetUserChatsQuery().data;
  const [deleteFriend] = useDeleteFriendMutation();
  const [deleteChat] = useDeleteChatMutation();

  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  const dispatch = useDispatch();

  async function handleFriendDelete(friend: UserData): Promise<void> {
    const chatId =
      chats?.filter(
        (chat) => chat.userIds.includes(friend.id) && chat.type === "single"
      )[0].id || "";
    //delete friend from current user and friend db docs
    deleteFriend({ friend, chatId });
    //delete chat between users
    deleteChat(chatId);
    //unselect the chat if it was with deleted friend
    if (selectedChatId === chatId) dispatch(selectChatId(null));
  }

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {user.friends.map((friend: UserData, index: number) => (
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
