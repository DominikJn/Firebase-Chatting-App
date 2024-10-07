import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import File from "./File";

interface MessageFormProps {
  handleMessageFormSubmit: (message: string, file: File) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({
  handleMessageFormSubmit,
}) => {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (message || file) {
      handleMessageFormSubmit(message, file as File);
    }
    setMessage("");
    setFile(null);
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="h-[60px] bg-slate-900 p-2 flex justify-between items-center gap-6 relative"
    >
      {file && (
        <div
          data-testid="file-view"
          className="absolute bottom-[100%] bg-slate-900 text-white p-4 w-1/2 flex justify-between"
        >
          <div className="w-1/5 h-auto">
            <File file={{ type: file.type, url: URL.createObjectURL(file) }} />
            <span>{file.name}</span>
          </div>
          <button className="text-4xl" onClick={() => setFile(null)}>
            X
          </button>
        </div>
      )}
      <input
        type="text"
        placeholder="Write a message..."
        className="w-full h-full py-3 px-6 text-2xl rounded-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <label htmlFor="file" className="cursor-pointer text-4xl text-white">
        <GoFileDirectoryFill />
        <input
          type="file"
          data-testid="file"
          id="file" //needed for label to be able to click on it
          className="hidden"
          value={""}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      </label>
      <button
        data-testid="submit"
        type="submit"
        className="text-white text-4xl"
      >
        <IoSend />
      </button>
    </form>
  );
};

export default MessageForm;
