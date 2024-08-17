import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserDocData from "../../types/UserDocData";

const COLLECTION_NAME: string = "users";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery(),
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
  }),
});
