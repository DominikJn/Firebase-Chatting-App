import React, { useState } from "react";
import ChatShortcut from "./ChatShortcut";
import CreateGroupModal from "../modals/CreateGroupModal";
import { useGetUserChatsQuery } from "../../features/api/chatApi";

const ChatList: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { data: chats, isLoading, isError } = useGetUserChatsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <>
      <h2 className="text-center text-2xl">Chats</h2>
      <div className="text-center text-gray-400">
        {isModalOpen && <CreateGroupModal setModalOpen={setModalOpen} />}
        <button
          onClick={() => setModalOpen(true)}
          className="hover:text-white duration-75"
        >
          Create New Chat
        </button>
      </div>
      {chats?.map((chat, index) => (
        <ChatShortcut key={`${index}`} chat={chat} />
      ))}
    </>
  );
};

export default ChatList;
