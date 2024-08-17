import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { selectChat } from "../../features/selectedChatSlice";
import type ChatData from "../../types/chat/ChatData";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import handleChatName from "../../utils/handleChatName";
import { HiUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { userApi } from "../../features/api/userApi";

interface ChatShortcutProps {
  chat: ChatData;
}

const ChatShortcut: React.FC<ChatShortcutProps> = ({ chat }) => {
  const user = userApi.endpoints.getUser.useQuery().data;
  const isChatUnseen = checkIfChatUnseen();
  const chatName = handleChatName(chat.chatName, chat.users);
  const dispatch = useDispatch();

  useEffect(() => {
    async function updateLastSelectedChatInFirestore(): Promise<void> {
      if (user) {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          lastSelectedChat: chat,
        });
      }
    }
    // Add event listener to update last selected chat in database when the window unloads
    window.addEventListener("beforeunload", updateLastSelectedChatInFirestore);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener(
        "beforeunload",
        updateLastSelectedChatInFirestore
      );
    };
  }, []);

  function checkIfChatUnseen(): boolean {
    return user ? chat.unseenBy.includes(user?.id) : false;
    // return false;
  }

  async function handleClick(): Promise<void> {
    //update last selected chat id and remove chat from unseen chats array in user doc
    if (user) {
      const chatRef = doc(db, "chats", chat.id);
      await updateDoc(chatRef, {
        unseenBy: arrayRemove(user.id),
      });
      dispatch(selectChat(chat));
      //update last selected chat id and remove chat from unseen chats array in user doc
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`${
        isChatUnseen && "font-bold"
      } cursor-pointer px-2 py-2 border-solid border-b flex flex-wrap`}
    >
      <div className="text-3xl flex items-center gap-2 px-2 text-slate-700">
        {chat.type === "single" ? <CgProfile /> : <HiUserGroup />}
        {isChatUnseen && (
          <div className="text-red-600 text-sm">New messages</div>
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
