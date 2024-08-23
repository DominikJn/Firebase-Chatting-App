import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateSelectedChat {
  value: string | null;
}

const initialState: InitialStateSelectedChat = {
  value: null,
};

export const selectedChatIdSlice = createSlice({
  name: "selectedChatId",
  initialState,
  reducers: {
    selectChatId: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectChatId } = selectedChatIdSlice.actions;

export default selectedChatIdSlice.reducer;
