import { serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { RiEditFill } from "react-icons/ri";
import type NormalMessageData from "../../types/message/NormalMessageData";
import type ChatData from "../../types/chat/ChatData";
import { useSendMessageMutation } from "../../features/api/messageApi";
import { useGetUserQuery } from "../../features/api/userApi";
import { useUpdateChatNameMutation } from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";
import ChatUsers from "./ChatUsers";

interface ChatOptionsProps {
  chat: ChatData;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ chat }) => {
  const [newChatName, setNewChatName] = useState<string>(chat.chatName);

  const user = useGetUserQuery().data as UserDocData;
  const [updateChatName] = useUpdateChatNameMutation();
  const [sendMessage] = useSendMessageMutation();

  const isAdmin = checkIfAdmin();

  function checkIfAdmin(): boolean {
    return user ? chat.admins.includes(user.id) : false;
  }

  async function changeChatname(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const message: NormalMessageData = {
      createdAt: serverTimestamp(),
      text: `ChatName has been changed to ${newChatName}`,
      type: "config",
      user: user.name,
      userId: user.id,
    };
    if (newChatName !== chat.chatName) {
      updateChatName({ chatId: chat.id, newChatName });
      sendMessage({ message, chatId: chat.id });
    }
  }

  return (
    <section className="h-full bg-slate-800 text-white flex flex-col gap-4">
      {isAdmin ? (
        <>
          <h3 className="text-center text-4xl">Chat Options</h3>
          <div>
            <h4 className="text-2xl">Change Chat Name</h4>
            <form
              onSubmit={(e) => changeChatname(e)}
              className="flex items-center gap-2 bg-slate-600 w-fit p-4 rounded-r-full"
            >
              <input
                type="text"
                className="text-black p-1 rounded-full"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
              />
              <button type="submit" className="text-3xl">
                <RiEditFill />
              </button>
            </form>
          </div>
        </>
      ) : (
        <h3>You have no access to chat settings.</h3>
      )}
      <ChatUsers userIds={chat.users} />
    </section>
  );
};

export default ChatOptions;
