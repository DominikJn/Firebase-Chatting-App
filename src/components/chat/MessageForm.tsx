import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { useMessageEditor } from "../context/MessageEditContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEditMessageMutation } from "../../features/api/messageApi";
import MessagePreview from "./MessagePreview";
import NormalMessageData from "../../types/message/NormalMessageData";

interface MessageFormProps {
  handleMessageFormSubmit: (message: string, file: File) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({
  handleMessageFormSubmit,
}) => {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const { selectedMessageToEdit, clearSelectedMessageToEdit } =
    useMessageEditor();

  const [editMessage] = useEditMessageMutation();
  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  console.log(selectedChatId);

  // prefill the form with the selected message to edit if it is selected, else clear it
  useEffect(() => {
    if (selectedMessageToEdit) {
      setMessage(selectedMessageToEdit.text);
    } else {
      clearSelectedMessageToEdit();
    }
  }, [selectedMessageToEdit]);

  //exit message edition mode when choosing new file
  useEffect(() => {
    clearSelectedMessageToEdit();
    if (selectedMessageToEdit) setMessage("");
  }, [file, setFile]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (selectedMessageToEdit) {
      editMessage({
        message: {
          ...selectedMessageToEdit,
          text: message,
          isEdited: true,
        } as NormalMessageData,
        chatId: selectedChatId || "",
      });
    } else {
      if (message || file) {
        handleMessageFormSubmit(message, file as File);
      }
    }
    setMessage("");
    setFile(null);
    clearSelectedMessageToEdit();
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="h-[60px] bg-slate-900 p-2 flex justify-between items-center gap-6 relative"
    >
      {file && <MessagePreview file={file} setFile={setFile} />}
      {selectedMessageToEdit && (
        <MessagePreview text={selectedMessageToEdit.text} setFile={setFile} />
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
