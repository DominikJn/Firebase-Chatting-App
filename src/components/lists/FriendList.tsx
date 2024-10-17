import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { selectChatId } from "../../features/selectedChatIdSlice";
import {
  useDeleteFriendMutation,
  useGetUserQuery,
  useGetUsersActivityStatusQuery,
} from "../../features/api/userApi";
import {
  useDeleteChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";
import ActivityDot from "../ActivityDot";

const FriendList: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const chats = useGetUserChatsQuery().data;
  const { data: friends } = useGetUsersActivityStatusQuery(user.friends);

  const [deleteFriend] = useDeleteFriendMutation();
  const [deleteChat] = useDeleteChatMutation();

  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  const dispatch = useDispatch();

  async function handleFriendDelete(friend: UserData): Promise<void> {
    const chatId =
      chats?.filter(
        (chat) => chat.users.includes(friend.id) && chat.type === "single"
      )[0].id || "";
    //delete friend from current user and friend db docs
    deleteFriend({ friendId: friend.id, chatId });
    //delete chat between users
    deleteChat(chatId);
    //unselect the chat if it was with deleted friend
    if (selectedChatId === chatId) dispatch(selectChatId(null));
  }

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {friends?.map((friend, index) => (
        <div
          key={`${friend.id}-${index}`}
          className="px-2 py-2 border-solid border-b flex flex-wrap justify-between text-3xl"
        >
          <div className="flex items-center gap-2 relative">
            <div className="rounded-full h-10 w-10 bg-slate-600 border-solid border-2 border-slate-950 relative">
              {friend!.status!.isActive && (
                <ActivityDot testidAdditional={`-friend-${friend.name}`} />
              )}
            </div>
            <span className=" truncate">{friend.name}</span>
          </div>
          <button
            className="text-slate-700 hover:text-red-800 duration-200"
            onClick={() => handleFriendDelete(friend)}
          >
            x
          </button>
        </div>
      ))}
    </>
  );
};

export default FriendList;
