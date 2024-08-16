import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/chat/Chat";
import ChatList from "../components/lists/ChatList";
import FriendList from "../components/lists/FriendList";
import InviteList from "../components/lists/InviteList";
import { useLocation } from "react-router";

const DashboardPage: React.FC = () => {
    const location = useLocation()

  return (
    <>
      <Navbar />
      <Sidebar>
        {location.pathname === "/chats" && <ChatList />}
        {location.pathname === "/friends" && <FriendList />}
        {location.pathname === "/invites" && <InviteList />}
      </Sidebar>
      <Chat />
    </>
  );
};

export default DashboardPage;
