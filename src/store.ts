import { configureStore } from "@reduxjs/toolkit";
import selectedChatIdReducer from "./features/selectedChatIdSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { basicApi } from "./features/api/basicApi";

export const store = configureStore({
  reducer: {
    selectedChatId: selectedChatIdReducer,
    [basicApi.reducerPath]: basicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      basicApi.middleware
    ),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
