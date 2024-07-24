import React from "react";
import { IoSend } from "react-icons/io5";

const Chat: React.FC = () => {
  return (
    <div className="w-full p-4">
      <div className="bg-gray-100 w-full h-full flex flex-col">
        <div className=" bg-slate-900 text-white text-2xl p-3">
          Friend's name
        </div>
        <div className="h-full overflow-y-scroll"></div>
        <form className="bg-slate-900 p-2 flex justify-between items-center gap-6">
          <input
            type="text"
            placeholder="Write a message..."
            className="w-full h-full py-3 px-6 text-2xl rounded-lg"
          />
          <button type="submit" className="text-white text-4xl">
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
