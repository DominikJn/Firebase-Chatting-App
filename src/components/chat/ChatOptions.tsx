import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase-config";
import { RiEditFill } from "react-icons/ri";

interface ChatOptionsProps {
  chat: {
    selectedChat: string;
    chatName: string;
  };
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ chat }) => {
  const [inputValue, setInputValue] = useState<string>(chat.chatName);

  async function changeChatname(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    await updateDoc(doc(db, "chats", chat.selectedChat), {
      chatName: inputValue,
    });
  }

  return (
    <div className="h-full bg-slate-800 text-white">
      <h3 className="text-center text-4xl">Chat Options</h3>
      <span>Change Chat Name</span>
      <form
        onSubmit={(e) => changeChatname(e)}
        className="flex items-center gap-2 bg-slate-600 w-fit p-4 rounded-r-full"
      >
        <input
          type="text"
          className="text-black p-1 rounded-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="text-3xl">
          <RiEditFill />
        </button>
      </form>
    </div>
  );
};

export default ChatOptions;
