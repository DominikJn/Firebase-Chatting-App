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
  deleteDoc,
} from "firebase/firestore";
import { db, fileDb } from "../../firebase-config";
import type NormalMessageData from "../../types/message/NormalMessageData";
import type ConfigMessageData from "../../types/message/ConfigMesageData";
import { basicApi } from "./basicApi";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

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

    editMessage: builder.mutation<
      string,
      { message: NormalMessageData; chatId: string }
    >({
      async queryFn({ message, chatId }) {
        try {
          const chatMessagesRef = doc(
            db,
            "chats",
            chatId,
            "messages",
            message.id
          );

          await updateDoc(chatMessagesRef, message);

          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    deleteMessage: builder.mutation<
      string,
      { chatId: string; messageId: string }
    >({
      async queryFn({ chatId, messageId }) {
        try {
          const chatMessagesRef = doc(
            db,
            "chats",
            chatId,
            "messages",
            messageId
          );

          await deleteDoc(chatMessagesRef);

          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    uploadFile: builder.mutation<
      { type: string; url: string },
      { path: string; file: File }
    >({
      async queryFn({ path, file }) {
        try {
          const fileRef = ref(fileDb, path);
          const uploadedFile = await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);

          return { data: { type: uploadedFile.metadata.contentType, url } };
        } catch (error) {
          return { error };
        }
      },
    }),

    deleteFile: builder.mutation<string, string>({
      async queryFn(path) {
        try {
          const fileRef = ref(fileDb, path);
          await deleteObject(fileRef);

          return { data: "file deleted" };
        } catch (error) {
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
  useGetChatFilesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
  useUpdateUnseenByMutation,
} = messageApi;
