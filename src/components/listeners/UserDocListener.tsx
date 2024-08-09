import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import { selectChat, setUnseenChats } from "../../features/chatsSlice";
import { setInvites } from "../../features/invitesSlice";
import { setFriends } from "../../features/friendsSlice";

const UserDocListener: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const userRef = doc(db, "users", user.uid);

    const unsub = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        dispatch(setInvites(snapshot.data().invites || []));
        dispatch(setFriends(snapshot.data().friends || []));
        dispatch(selectChat(snapshot.data().lastSelectedChat || null));
        dispatch(setUnseenChats(snapshot.data().unseenChats || []));
      }
    });

    return () => unsub();
  }, []);
  return null;
};

export default UserDocListener;
