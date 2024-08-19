import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/chat/Chat";
import { Outlet } from "react-router";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Navbar />

      <Sidebar>
        <Outlet />
      </Sidebar>

      <Chat />
    </>
  );
};

export default DashboardPage;
