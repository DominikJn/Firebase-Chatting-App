import { createSlice } from "@reduxjs/toolkit";
import type ChatData from "../types/ChatData";

interface InitialStateChat {
  value: {
    chats: ChatData[];
    selectedChat: string;
    chatName: string;
  };
}

const initialState: InitialStateChat = {
  value: {
    chats: [],
    selectedChat: "",
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
    selectChat: (state, action) => {
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
