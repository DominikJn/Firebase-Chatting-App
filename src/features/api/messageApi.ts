import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  onSnapshot,
  doc,
  QueryDocumentSnapshot,
  query,
  where,
  updateDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import type NormalMessageData from "../../types/message/NormalMessageData";
import type ConfigMessageData from "../../types/message/ConfigMesageData";
import createMessageDoc from "../utils/createMessageDoc";

const COLLECTION_NAME: string = "messages";

// Define the API slice
export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getChatMessages: builder.query<(NormalMessageData | ConfigMessageData)[], string>({
      queryFn: () => {
        // Return an initial empty array (or other initial state)
        return { data: [] };
      },
      async onCacheEntryAdded(
        chatId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;

        // Subscribe to real-time updates using onSnapshot
        const messagesRef = collection(db, COLLECTION_NAME);
        const queryMessages = query(
          messagesRef,
          where("chat", "==", chatId),
          orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
          updateCachedData((draft) => {
            snapshot.docChanges().forEach((change) => {
              const doc = change.doc as QueryDocumentSnapshot<
                NormalMessageData | ConfigMessageData
              >;
              switch (change.type) {
                case "added":
                  draft.push({ id: doc.id, ...doc.data() });
                  break;
                case "modified":
                  const index = draft.findIndex((item) => item.id === doc.id);
                  if (index !== -1) {
                    draft[index] = { id: doc.id, ...doc.data() };
                  }
                  break;
                case "removed":
                  const removeIndex = draft.findIndex(
                    (item) => item.id === doc.id
                  );
                  if (removeIndex !== -1) {
                    draft.splice(removeIndex, 1); // Remove the message from the draft
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
    sendMessage: builder.mutation<string, Omit<NormalMessageData | ConfigMessageData, "id">>({
      async queryFn(message) {
        try {
          //create message doc
          const docRef = await createMessageDoc(message);
          //update lastMessage in chat doc
          await updateDoc(doc(db, "chats", message.chat), {
            lastMessage: message.text,
            lastMessageTimestamp: serverTimestamp(),
          });
          return { data: docRef.id };
        } catch (error: any) {
          return { error};
        }
      },
    }),

    //update unseen chats array in users' docs
    updateUnseenChats: builder.mutation<string, { userIds: string[], chatId: string }>({
      async queryFn({ userIds, chatId }) {
        const batch = writeBatch(db);
        userIds.forEach((userId) => {
          const docRef = doc(db, "users", userId);
          batch.update(docRef, { unseenChats: arrayUnion(chatId) });
        });
      
        try {
          await batch.commit();
          return { data: 'Unseen chats updated successfuly' }
        } catch (error: any) {
          return { error };
        }
      }
    })
  }),
});
