import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type ChatData from "../types/chat/ChatData";

interface InitialStateSelectedChat {
  value: ChatData | null;
}

const initialState: InitialStateSelectedChat = {
  value: null,
};

export const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<ChatData | null>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectChat } = selectedChatSlice.actions;

export default selectedChatSlice.reducer;
