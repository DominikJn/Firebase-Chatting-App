import { createSlice } from "@reduxjs/toolkit";
import type UserData from "../types/UserData";

interface InitialStateFriend {
  value: UserData[];
}

const initialState: InitialStateFriend = {
  value: [],
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
