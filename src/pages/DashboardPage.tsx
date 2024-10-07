import React from "react";
import Navbar from "../components/Navbar";
import Chat from "../components/chat/Chat";
import { Outlet } from "react-router";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Navbar />

      <aside className="min-w-[15%] max-w-[15%] rounded-lg text-white overflow-x-hidden overflow-y-auto">
        <Outlet />
      </aside>

      <Chat />
    </>
  );
};

export default DashboardPage;
