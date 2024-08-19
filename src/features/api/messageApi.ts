import {
  collection,
  onSnapshot,
  doc,
  QueryDocumentSnapshot,
  query,
  updateDoc,
  serverTimestamp,
  orderBy,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import type NormalMessageData from "../../types/message/NormalMessageData";
import type ConfigMessageData from "../../types/message/ConfigMesageData";
import { basicApi } from "./basicApi";

export const messageApi = basicApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<
      (NormalMessageData | ConfigMessageData)[],
      string
    >({
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
        const chatMessagesRef = collection(db, "chats", chatId, "messages");
        const queryMessages = query(chatMessagesRef, orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
          updateCachedData((draft) => {
            snapshot.docChanges().forEach((change) => {
              const doc = change.doc as QueryDocumentSnapshot<
                NormalMessageData | ConfigMessageData
              >;
              switch (change.type) {
                case "added":
                  draft.push({ ...doc.data() });
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

    sendMessage: builder.mutation<
      string,
      { message: NormalMessageData | ConfigMessageData; chatId: string }
    >({
      async queryFn({ message, chatId }) {
        try {
          //create message doc in chat subcollection
          const chatMessagesRef = collection(db, "chats", chatId, "messages");
          const docRef = await addDoc(chatMessagesRef, message);
          //update lastMessage in chat doc
          await updateDoc(doc(db, "chats", chatId), {
            lastMessage: message.text,
            lastMessageTimestamp: serverTimestamp(),
          });
          return { data: docRef.id };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    // update unseen chats array in users' docs
    updateUnseenBy: builder.mutation<
      string,
      { userIds: string[]; chatId: string }
    >({
      async queryFn({ userIds, chatId }) {
        try {
          const chatRef = doc(db, "chats", chatId);
          await updateDoc(chatRef, { unseenBy: arrayUnion(...userIds) });

          return { data: "Unseen chats updated successfuly" };
        } catch (error: any) {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useUpdateUnseenByMutation,
} = messageApi;
