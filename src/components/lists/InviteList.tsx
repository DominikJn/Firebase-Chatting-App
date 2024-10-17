import React from "react";
import type UserData from "../../types/UserData";
import { serverTimestamp } from "firebase/firestore";
import type ChatData from "../../types/chat/ChatData";
import {
  useAcceptInviteMutation,
  useGetUserQuery,
  useRejectInviteMutation,
} from "../../features/api/userApi";
import { useAddChatMutation } from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";

const InviteList: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const [acceptInvite] = useAcceptInviteMutation();
  const [rejectInvite] = useRejectInviteMutation();
  const [addChat] = useAddChatMutation();

  async function handleAccept(invite: UserData): Promise<void> {
    acceptInvite(invite);
    //add chat between users
    const users: string[] = [user.id, invite.id];
    const newChat: ChatData = {
      id: "",
      users,
      admins: users,
      unseenBy: users,
      type: "single",
      chatName: "",
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
    };
    addChat(newChat);
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
            <button onClick={() => rejectInvite(invite)}>X</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default InviteList;
