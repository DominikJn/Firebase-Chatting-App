import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import createChatDoc from "../../utils/createChatDoc";

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
    //add chat between users
    const users: UserData[] = [{ name: user.name, id: user.uid }, invite];
    await createChatDoc(users);
  }

  async function handleReject(invite: UserData): Promise<void> {
    //delete invite from invites array
    await updateDoc(doc(db, "users", user.uid), {
      invites: arrayRemove(invite),
    });
  }

  return (
    <>
      <h2 className="text-center text-2xl">Invites</h2>
      {invites.map((invite, index) => (
        <div
          key={`${invite.id}-${index}`}
          className="bg-slate-600 rounded-full text-2xl cursor-pointer px-6 py-3 m-2 flex justify-between"
        >
          <span>{invite.name}</span>
          <div className="flex gap-3">
            <button onClick={() => handleAccept(invite)}>Y</button>
            <button onClick={() => handleReject(invite)}>X</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default InviteList;
