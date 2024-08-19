import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";

interface MessageFormProps {
  handleMessageFormSubmit: (message: string, file: File) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({
  handleMessageFormSubmit,
}) => {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    console.log(file);
  }, [file]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleMessageFormSubmit(message, file as File);
    setMessage("");
    setFile(null);
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
      <label htmlFor="file" className="cursor-pointer text-4xl text-white">
        <GoFileDirectoryFill />
        <input
          type="file"
          id="file"
          className="hidden"
          value={""}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      </label>
      <button type="submit" className="text-white text-4xl">
        <IoSend />
      </button>
    </form>
  );
};

export default MessageForm;
