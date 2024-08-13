import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { userApi } from "../features/api/userApi";

const Navbar: React.FC = () => {
  const user = userApi.endpoints.getUser.useQuery().data;
  // const unseenChats = useSelector((state: RootState) => state.chats.value.unseenChats);

  return (
    <div className="p-6 text-4xl text-white flex flex-col gap-6">
      <Link to="/" className="relative">
        <IoIosChatboxes />
        {user && user.unseenChats.length > 0 && (
          <div className="absolute -top-2 -right-2 text-sm bg-red-600 rounded-full p-2"></div>
        )}
      </Link>
      <Link to="/friends">
        <FaUserFriends />
      </Link>
      <Link to="/invites" className="relative">
        <FaEnvelope />
        {user && user.invites.length > 0 && (
          <div className="absolute -top-3 -right-3 text-sm bg-red-600 rounded-full p-1">
            {user.invites.length}
          </div>
        )}
      </Link>
    </div>
  );
};

export default Navbar;
