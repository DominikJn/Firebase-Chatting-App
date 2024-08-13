import { configureStore } from "@reduxjs/toolkit";
import selectedChatReducer from "./features/selectedChatSlice";
import { chatApi } from "./features/api/chatApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { messageApi } from "./features/api/messageApi";
import { userApi } from "./features/api/userApi";

export const store = configureStore({
  reducer: {
    selectedChat: selectedChatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(chatApi.middleware)
      .concat(messageApi.middleware)
      .concat(userApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
