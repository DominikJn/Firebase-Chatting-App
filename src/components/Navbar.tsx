import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Navbar: React.FC = () => {
  const invites = useSelector((state: RootState) => state.invites.value);
  const unseenChats = useSelector((state: RootState) => state.chats.value.unseenChats);

  return (
    <div className="p-6 text-4xl text-white flex flex-col gap-6">
      <Link to="/" className="relative">
        <IoIosChatboxes />
        {unseenChats.length > 0 && (
          <div className="absolute -top-2 -right-2 text-sm bg-red-600 rounded-full p-2"></div>
        )}
      </Link>
      <Link to="/friends">
        <FaUserFriends />
      </Link>
      <Link to="/invites" className="relative">
        <FaEnvelope />
        {invites.length > 0 && (
          <div className="absolute -top-3 -right-3 text-sm bg-red-600 rounded-full p-1">
            {invites.length}
          </div>
        )}
      </Link>
    </div>
  );
};

export default Navbar;
