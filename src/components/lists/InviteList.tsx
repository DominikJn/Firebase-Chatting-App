import React from "react";
import type UserData from "../../types/UserData";
import {
  arrayRemove,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import type ChatData from "../../types/chat/ChatData";
import { useGetUserQuery } from "../../features/api/userApi";
import { useAddChatMutation } from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";

const InviteList: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const [addChat] = useAddChatMutation();

  async function handleAccept(invite: UserData): Promise<void> {
    //update current user profile
    await updateDoc(doc(db, "users", user.id), {
      friends: arrayUnion(invite),
      invites: arrayRemove(invite),
    });
    //update inviting user profile
    await updateDoc(doc(db, "users", invite.id), {
      friends: arrayUnion({ name: user.name, id: user.id }),
    });
    //add chat between users
    const users = [{ name: user.name, id: user.id }, invite];
    const userIds = users.map((user) => user.id);
    const newChat: ChatData = {
      id: "",
      users,
      userIds,
      admins: userIds,
      unseenBy: userIds,
      type: "single",
      chatName: "",
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
    };
    addChat(newChat);
  }

  async function handleReject(invite: UserData): Promise<void> {
    //delete invite from invites array
    await updateDoc(doc(db, "users", user.id), {
      invites: arrayRemove(invite),
    });
  }

  return (
    <>
      <h2 className="text-center text-2xl">Invites</h2>
      {user?.invites.map((invite, index) => (
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
