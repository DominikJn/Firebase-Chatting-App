import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type ChatData from "../types/chat/ChatData";

interface InitialStateChat {
  value: {
    chats: ChatData[];
    selectedChat: ChatData | null;
    chatName: string;
  };
}

const initialState: InitialStateChat = {
  value: {
    chats: [],
    selectedChat: null,
    chatName: "",
  },
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.value.chats = action.payload;
    },
    selectChat: (state, action: PayloadAction<ChatData | null>) => {
      state.value.selectedChat = action.payload;
    },
    setChatName: (state, action) => {
      state.value.chatName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChats, selectChat, setChatName } = chatsSlice.actions;

export default chatsSlice.reducer;
