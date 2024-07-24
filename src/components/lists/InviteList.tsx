import React from "react";
import ListStyleTemplate from "./ListStyleTemplate";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

const InviteList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const invites = useSelector((state: RootState) => state.invites.value);

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
  }

  async function handleReject(invite: UserData): Promise<void> {
    //delete invite from invites array
    await updateDoc(doc(db, "users", user.uid), {
      invites: arrayRemove(invite),
    });
  }

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
