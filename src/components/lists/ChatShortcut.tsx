import React from "react";
import { useDispatch } from "react-redux";
import { selectChatId } from "../../features/selectedChatIdSlice";
import type ChatData from "../../types/chat/ChatData";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import handleChatName from "../../utils/handleChatName";
import { HiUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import {
  useGetUserQuery,
  useGetUsersActivityStatusQuery,
} from "../../features/api/userApi";
import UserDocData from "../../types/UserDocData";
import ActivityDot from "../ActivityDot";

interface ChatShortcutProps {
  chat: ChatData;
}

const ChatShortcut: React.FC<ChatShortcutProps> = ({ chat }) => {
  const user = useGetUserQuery().data as UserDocData;
  const { data: chatUsers } = useGetUsersActivityStatusQuery(chat.users);

  const isChatUnseen = checkIfChatUnseen();
  const chatName = handleChatName(chat.chatName, chatUsers || [], chat.type);

  const dispatch = useDispatch();

  function checkIfChatUnseen(): boolean {
    return chat.unseenBy.includes(user?.id);
  }

  async function handleClick(): Promise<void> {
    //update last selected chat id and remove chat from unseen chats array in user doc
    if (user) {
      const chatRef = doc(db, "chats", chat.id);
      await updateDoc(chatRef, {
        unseenBy: arrayRemove(user.id),
      });
      dispatch(selectChatId(chat.id));
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`${
        isChatUnseen && "font-bold"
      } cursor-pointer px-2 py-2 border-solid border-b flex flex-wrap`}
      data-testid="container"
    >
      <div className="text-3xl flex items-center gap-2 px-2 text-slate-700 relative">
        <div className="relative">
          {chat.type === "single" ? (
            <CgProfile data-testid="single" />
          ) : (
            <HiUserGroup data-testid="group" />
          )}
          {chatUsers?.some(
            (chatUser) => chatUser!.status!.isActive && chatUser.id !== user.id
          ) && <ActivityDot />}
        </div>
        {isChatUnseen && (
          <div className="text-red-600 text-sm" data-testid="unseen">
            New messages
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl">{chatName}</span>
        <span className="text-slate-400 truncate">{chat.lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatShortcut;
