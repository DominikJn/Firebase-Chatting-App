import { createSlice } from "@reduxjs/toolkit";

interface InitialStateChat {
  value: {
    selectedChat: string;
  };
}

const initialState: InitialStateChat = {
  value: {
    selectedChat: "",
  },
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.value.selectedChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectChat } = chatsSlice.actions;

export default chatsSlice.reducer;
