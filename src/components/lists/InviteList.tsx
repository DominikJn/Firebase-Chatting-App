import React, { useEffect } from "react";
import ListStyleTemplate from "./ListStyleTemplate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { setInvites } from "../../features/invitesSlice";

const InviteList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const invites = useSelector((state: RootState) => state.invites.value);
  const dispatch = useDispatch();

  async function handleAccept(invite: UserData): Promise<void> {
    //update current user profile
    await updateDoc(doc(db, "users", user.uid), {
      friends: arrayUnion(invite),
      invites: arrayRemove(invite),
    });
    //update inviting user profile
    await updateDoc(doc(db, "users", invite.id), {
      friends: arrayUnion({ name: user.name, id: user.uid }),
    });
    //add chat between users
    await addDoc(collection(db, 'chats'), {
      userIds: [user.uid, invite.id],
      users: [
        { name: user.name, id: user.uid },
        { name: invite.name, id: invite.id },
      ]
    })
  }

  async function handleReject(invite: UserData): Promise<void> {
    //delete invite from invites array
    await updateDoc(doc(db, "users", user.uid), {
      invites: arrayRemove(invite),
    });
  }

  useEffect(() => {
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        dispatch(setInvites(snapshot.data().invites));
        console.log("new invite!");
      } else {
        console.log("no such document");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ListStyleTemplate>
      <h2 className="text-center text-2xl">Invites</h2>
      {invites.map((invite, index) => (
        <div
          key={`${invite.id}-${index}`}
          className="bg-slate-600 m-2 py-2 px-4 rounded-full flex justify-between"
        >
          <span>{invite.name}</span>
          <div className="flex gap-3">
            <button onClick={() => handleAccept(invite)}>Y</button>
            <button onClick={() => handleReject(invite)}>X</button>
          </div>
        </div>
      ))}
    </ListStyleTemplate>
  );
};

export default InviteList;
