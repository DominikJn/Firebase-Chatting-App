import React, { createContext, useContext, useState } from "react";
import NormalMessageData from "../../types/message/NormalMessageData";

interface MessageContextType {
  selectedMessageToEdit: NormalMessageData | null;
  editMessage: (message: NormalMessageData) => void;
  clearSelectedMessageToEdit: () => void;
}

// Create the Message Context
export const MessageEditContext = createContext<MessageContextType | null>(null);

export const MessageEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedMessageToEdit, setSelectedMessageToEdit] =
    useState<NormalMessageData | null>(null);

  const editMessage = (message: NormalMessageData) => {
    setSelectedMessageToEdit(message); // Set the message to be edited
  };

  const clearSelectedMessageToEdit = () => {
    setSelectedMessageToEdit(null); // Clear the selected message after editing
  };

  return (
    <MessageEditContext.Provider
      value={{
        selectedMessageToEdit,
        editMessage,
        clearSelectedMessageToEdit,
      }}
    >
      {children}
    </MessageEditContext.Provider>
  );
};

// Custom hook to use the Message Context
export const useMessageEditor = (): MessageContextType => {
  const context = useContext(MessageEditContext);

  // Check if context is null and throw an error if it is
  if (context === null) {
    throw new Error("useMessageEditor must be used within a MessageProvider");
  }

  return context;
};
