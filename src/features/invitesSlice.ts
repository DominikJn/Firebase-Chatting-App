import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: []
};

export const invitesSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {
    setInvites: (state, action) => {
        state.value = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setInvites } = invitesSlice.actions;

export default invitesSlice.reducer;
