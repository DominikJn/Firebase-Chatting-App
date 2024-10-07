import {
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserDocData from "../../types/UserDocData";
import { basicApi } from "./basicApi";
import UserData from "../../types/UserData";

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
      { friend: UserData; chatId: string }
    >({
      async queryFn({ friend, chatId }) {
        try {
          const user = auth.currentUser || { displayName: "", uid: "" };
          // update current users's profile
          await updateDoc(doc(db, "users", user.uid), {
            friends: arrayRemove(friend),
            unseenChats: arrayRemove(chatId),
            lastSelectedChat: null,
          });
          //update deleted friend's profile
          await updateDoc(doc(db, "users", friend.id), {
            friends: arrayRemove({ name: user.displayName, id: user.uid }),
            unseenChats: arrayRemove(chatId),
            lastSelectedChat: null,
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
            friends: arrayUnion(invite),
            invites: arrayRemove(invite),
          });
          //update inviting user profile
          await updateDoc(doc(db, "users", invite.id), {
            friends: arrayUnion({ name: user.displayName, id: user.uid }),
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
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteFriendMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
} = userApi;
