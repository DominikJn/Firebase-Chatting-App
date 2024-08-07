import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ChatShortcut from "./ChatShortcut";
import CreateGroupModal from "../modals/CreateGroupModal";

const ChatList: React.FC = () => {
  const chats = useSelector((state: RootState) => state.chats.value.chats);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

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
      {chats.map((chat, index) => (
        <ChatShortcut key={`${index}`} chat={chat} />
      ))}
    </>
  );
};

export default ChatList;
