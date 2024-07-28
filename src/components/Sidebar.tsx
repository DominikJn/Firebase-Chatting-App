import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setInvites } from "../features/invitesSlice";
import { setFriends } from "../features/friendsSlice";
import { db } from "../firebase-config";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        dispatch(setInvites(snapshot.data().invites));
        dispatch(setFriends(snapshot.data().friends));
        console.log("new invite!");
      } else {
        console.log("no such document");
      }
    });

    return () => unsubscribe();
  }, []);

  return <div className="w-[15%] rounded-lg text-white">{children}</div>;
};

export default Sidebar;
