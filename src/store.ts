import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import invitesReducer from "./features/invitesSlice";
import friendsReducer from "./features/friendsSlice";
import chatsReducer from "./features/chatsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    invites: invitesReducer,
    friends: friendsReducer,
    chats: chatsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
