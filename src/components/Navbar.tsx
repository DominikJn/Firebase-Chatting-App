import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="p-6 text-4xl text-white flex flex-col gap-6">
      <Link to="/">
        <IoIosChatboxes />
      </Link>
      <Link to="/friends">
        <FaUserFriends />
      </Link>
      <Link to="/invites">
        <FaEnvelope />
      </Link>
    </div>
  );
};

export default Navbar;
