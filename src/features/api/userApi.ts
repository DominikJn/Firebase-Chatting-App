import {
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  where,
  QueryDocumentSnapshot,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, realTimeDb } from "../../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserDocData from "../../types/UserDocData";
import { basicApi } from "./basicApi";
import UserData from "../../types/UserData";
import { ref, set, onDisconnect, onValue } from "firebase/database";

const COLLECTION_NAME: string = "users";

export const userApi = basicApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserDocData | null, void>({
      queryFn: () => {
        return { data: null }; // Initial empty state
      },
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;

        // Get the authentication object
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDocRef = doc(db, COLLECTION_NAME, user.uid);

            //update user activity status
            const userStatusRef = ref(realTimeDb, `status/${user.uid}`);
            const connectedRef = ref(realTimeDb, ".info/connected");

            const isOfflineForDatabase = {
              state: "offline",
              last_changed: Date.now(),
            };

            const isOnlineForDatabase = {
              state: "online",
              last_changed: Date.now(),
            };

            onValue(connectedRef, async (snapshot) => {
              if (snapshot.val()) {
                await set(userStatusRef, isOnlineForDatabase);
                await updateDoc(userDocRef, {
                  status: {
                    isActive: true, // Update Firestore isActive to true
                    lastOnline: null,
                  },
                });
                return;
              } else {
                await set(userStatusRef, isOfflineForDatabase);
                await updateDoc(userDocRef, {
                  status: {
                    isActive: false, // Update Firestore isActive to false
                    lastOnline: serverTimestamp(),
                  },
                });
                return;
              }
            });

            // Set user status to online
            await set(userStatusRef, isOnlineForDatabase);

            // Set user to offline when the connection is lost
            onDisconnect(userStatusRef).set(isOfflineForDatabase);

            // Listen to real-time updates for the authenticated user's document
            const unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
              updateCachedData(() => {
                if (snapshot.exists()) {
                  const data = {
                    ...snapshot.data(),
                    id: snapshot.id,
                  } as UserDocData;
                  return data ? data : null;
                }
              });
            });

            // Clean up the user document listener when the auth state changes
            await cacheEntryRemoved;
            unsubscribeUser();
          } else {
            updateCachedData(() => null);
          }
        });

        // Clean up the auth state listener when the cache entry is removed
        await cacheEntryRemoved;
        unsubscribeAuth();
      },
    }),

    getUsersActivityStatus: builder.query<UserData[], string[]>({
      queryFn: () => {
        // Return an initial empty array (or other initial state)
        return { data: [] };
      },
      async onCacheEntryAdded(
        userIds,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;

        const usersRef = collection(db, COLLECTION_NAME);

        const queryUsers = query(usersRef, where("id", "in", userIds));
        // Listen to real-time updates for the authenticated user's document
        const unsubscribe = onSnapshot(queryUsers, (snapshot) => {
          updateCachedData((draft) => {
            snapshot.docChanges().forEach((change) => {
              const doc = change.doc as QueryDocumentSnapshot<UserData>;
              switch (change.type) {
                case "added":
                  draft.push({ ...doc.data(), id: doc.id });
                  break;
                case "modified":
                  const index = draft.findIndex((item) => item.id === doc.id);
                  if (index !== -1) {
                    draft[index] = {
                      id: doc.id,
                      name: doc.data().name,
                      status: doc.data().status,
                    };
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

    updateUser: builder.mutation<string, UserDocData>({
      async queryFn(user) {
        try {
          const userRef = doc(db, COLLECTION_NAME, user.id);
          await updateDoc(userRef, { ...user });

          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    deleteFriend: builder.mutation<
      string,
      { friendId: string; chatId: string }
    >({
      async queryFn({ friendId, chatId }) {
        try {
          const user = auth.currentUser || { displayName: "", uid: "" };
          // update current users's profile
          await updateDoc(doc(db, "users", user.uid), {
            friends: arrayRemove(friendId),
            unseenChats: arrayRemove(chatId),
            lastSelectedChat: null,
          });
          //update deleted friend's profile
          await updateDoc(doc(db, "users", friendId), {
            friends: arrayRemove(user.uid),
            unseenChats: arrayRemove(chatId),
            lastSelectedChat: null,
          });
          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    sendInvite: builder.mutation<string, string>({
      async queryFn(searchedUserId) {
        try {
          const user = auth.currentUser || { displayName: "", uid: "" };
          const userRef = doc(db, "users", searchedUserId);
          //update current user profile
          await updateDoc(userRef, {
            invites: arrayUnion({ name: user.displayName, id: user.uid }),
          });
          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    acceptInvite: builder.mutation<string, UserData>({
      async queryFn(invite) {
        try {
          const user = auth.currentUser || { displayName: "", uid: "" };
          //update current user profile
          await updateDoc(doc(db, "users", user.uid), {
            friends: arrayUnion(invite.id),
            invites: arrayRemove(invite),
          });
          //update inviting user profile
          await updateDoc(doc(db, "users", invite.id), {
            friends: arrayUnion(user.uid),
          });
          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    rejectInvite: builder.mutation<string, UserData>({
      async queryFn(invite) {
        try {
          const user = auth.currentUser || { displayName: "", uid: "" };
          //delete invite from invites array
          await updateDoc(doc(db, "users", user.uid), {
            invites: arrayRemove(invite),
          });
          return { data: "User doc updated!" };
        } catch (error: any) {
          return { error };
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserQuery,
  useGetUsersActivityStatusQuery,
  useUpdateUserMutation,
  useDeleteFriendMutation,
  useSendInviteMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
} = userApi;
