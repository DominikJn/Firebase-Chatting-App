import { createSlice } from "@reduxjs/toolkit";

interface InitialStateChat {
  value: {
    selectedChat: string;
    chatName: string;
  };
}

const initialState: InitialStateChat = {
  value: {
    selectedChat: "",
    chatName: "",
  },
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.value.selectedChat = action.payload;
    },
    setChatName: (state, action) => {
      state.value.chatName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectChat, setChatName } = chatsSlice.actions;

export default chatsSlice.reducer;
