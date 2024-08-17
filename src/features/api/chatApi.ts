import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  QueryDocumentSnapshot,
  query,
  where,
  updateDoc,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import ChatData from "../../types/chat/ChatData";
import MessageData from "../../types/message/MessageData";

const COLLECTION_NAME: string = "chats";

// Define the API slice
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getUserChats: builder.query<ChatData[], void>({
      queryFn: () => {
        // Return an initial empty array (or other initial state)
        return { data: [] };
      },
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;

        // Subscribe to real-time updates using onSnapshot
        const chatsRef = collection(db, COLLECTION_NAME);
        const userId = auth.currentUser?.uid;
        const queryChats = query(
          chatsRef,
          where("userIds", "array-contains", userId),
          orderBy("lastMessageTimestamp", "desc")
        );
        const unsubscribe = onSnapshot(queryChats, (snapshot) => {
          updateCachedData((draft) => {
            snapshot.docChanges().forEach((change) => {
              const doc = change.doc as QueryDocumentSnapshot<ChatData>;
              switch (change.type) {
                case "added":
                  draft.push({ ...doc.data(), id: doc.id });
                  break;
                case "modified":
                  const index = draft.findIndex((item) => item.id === doc.id);
                  if (index !== -1) {
                    draft[index] = { ...doc.data(), id: doc.id };
                  }
                  break;
                case "removed":
                  const removeIndex = draft.findIndex(
                    (item) => item.id === doc.id
                  );
                  if (removeIndex !== -1) {
                    draft.splice(removeIndex, 1); // Remove the chat from the draft
                  }
                  break;
              }
            });
          });
        });

        // Clean up the listener when the cache entry is removed
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),

    //create chat doc in chats collection
    addChat: builder.mutation<string, Omit<ChatData, "id">>({
      async queryFn(newChat) {
        try {
          //create chat doc
          const chatsRef = collection(db, "chats");
          const docRef = await addDoc(chatsRef, newChat);
          //create message doc in chat subcollection
          const chatMessagesRef = collection(
            db,
            "chats",
            docRef.id,
            "messages"
          );
          const message: MessageData = {
            type: "config",
            text: "Created new chat!",
            createdAt: serverTimestamp(),
          };
          await addDoc(chatMessagesRef, message);

          return { data: docRef.id };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    //update chatName field in chat doc
    updateChatName: builder.mutation<string, { chatId: string; newChatName: string }>({
      async queryFn({ chatId, newChatName }) {
        try {
          const chatRef = doc(db, "chats", chatId);
          await updateDoc(chatRef, { chatName: newChatName });
          return { data: chatId };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    //delete chat doc from chats collection
    deleteChat: builder.mutation<string, Omit<string, "id">>({
      async queryFn(chatId) {
        try {
          const chatRef = doc(db, COLLECTION_NAME, chatId as string);
          await deleteDoc(chatRef);
          return { data: "Chat successfuly deleted" };
        } catch (error: any) {
          return { error };
        }
      },
    }),
  }),
});
