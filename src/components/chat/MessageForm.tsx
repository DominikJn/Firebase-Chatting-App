import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

interface MessageFormProps {
  sendMessage: (message: string) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if(message) {
      sendMessage(message);
      setMessage("");
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="h-[60px] bg-slate-900 p-2 flex justify-between items-center gap-6"
    >
      <input
        type="text"
        placeholder="Write a message..."
        className="w-full h-full py-3 px-6 text-2xl rounded-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="text-white text-4xl">
        <IoSend />
      </button>
    </form>
  );
};

export default MessageForm;
