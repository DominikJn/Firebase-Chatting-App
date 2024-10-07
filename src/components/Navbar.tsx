import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../features/api/userApi";
import { useGetUserChatsQuery } from "../features/api/chatApi";
import UserDocData from "../types/UserDocData";

const Navbar: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const chats = useGetUserChatsQuery().data;
  const hasUnseenChats: boolean = checkForUnseenChats();

  function checkForUnseenChats(): boolean {
    const userId = user?.id || "";
    return chats ? chats.some((chat) => chat.unseenBy.includes(userId)) : false;
  }

  return (
    <nav className="p-6 text-4xl text-white flex flex-col gap-6">
      <Link to="/" className="relative">
        <IoIosChatboxes />
        {hasUnseenChats && (
          <div
            data-testid="chats-highlight"
            className="absolute -top-2 -right-2 bg-red-600 p-2 rounded-full"
          ></div>
        )}
      </Link>
      <Link to="/friends">
        <FaUserFriends />
      </Link>
      <Link to="/invites" className="relative">
        <FaEnvelope />
        {user.invites.length > 0 && (
          <div
            data-testid="invites-highlight"
            className="absolute -top-3 -right-3 text-sm bg-red-600 rounded-full p-1"
          >
            {user.invites.length}
          </div>
        )}
      </Link>
    </nav>
  );
};

export default Navbar;
