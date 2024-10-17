import React, { useEffect, useState } from "react";
import type UserData from "../../types/UserData";
import { serverTimestamp } from "firebase/firestore";
import {
  useGetUserQuery,
  useGetUsersActivityStatusQuery,
} from "../../features/api/userApi";
import ChatData from "../../types/chat/ChatData";
import { useAddChatMutation } from "../../features/api/chatApi";
import UserDocData from "../../types/UserDocData";

interface CreateGroupModalProps {
  setModalOpen: (arg: boolean) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  setModalOpen,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<UserData[]>([]);
  const [chosenFriends, setChosenFriends] = useState<UserData[]>([]);

  const user = useGetUserQuery().data as UserDocData;
  const { data: friends, isLoading } = useGetUsersActivityStatusQuery(
    user.friends
  );
  const [addChat] = useAddChatMutation();

  //ensure that friends are fetched
  useEffect(() => {
    if (friends) setFilteredFriends(friends);
  }, [friends]);

  useEffect(() => {
    if (!isLoading) {
      const filteredFriends: UserData[] = friends!.filter((friend) =>
        friend.name.includes(searchValue.toLowerCase())
      );
      setFilteredFriends(filteredFriends);
    }
  }, [searchValue]);

  function handleChoose(friend: UserData): void {
    if (chosenFriends.includes(friend)) {
      //remove friend from chosen users
      const friendIndex = chosenFriends.indexOf(friend);
      const updatedArray = chosenFriends.toSpliced(friendIndex, 1);
      setChosenFriends(updatedArray);
    } else {
      //add friend to chosen users
      setChosenFriends((prev) => [...prev, friend]);
    }
  }

  function handleGroupCreation(): void {
    const finalUsers = [...chosenFriends, { name: user.name, id: user.id }];
    const users = finalUsers.map((finalUser) => finalUser.id);
    //create document in chats
    const newChat: ChatData = {
      id: "",
      users,
      admins: users,
      unseenBy: users,
      type: "group",
      chatName: "",
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
    };
    addChat(newChat);
  }

  return (
    <div
      data-testid="modal"
      className="absolute left-0 top-0 z-50 bg-black/40 text-white h-full w-full grid place-items-center"
    >
      <div className="bg-slate-800 w-1/3 h-1/2 p-4 flex flex-col gap-4">
        <button data-testid="close" onClick={() => setModalOpen(false)}>
          X
        </button>
        <form className="flex flex-col gap-2 text-black">
          <input
            type="text"
            placeholder="Search in friends..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        <ul className="flex gap-3 text-3xl">
          {filteredFriends.map((friend, index) => (
            <li
              key={index}
              className={`border-dashed border rounded-full w-fit py-1 px-3 flex gap-2 ${
                chosenFriends.includes(friend) && "text-gray-400"
              }`}
            >
              <span>{friend.name}</span>
              <button
                data-testid={
                  chosenFriends.includes(friend)
                    ? `delete-${friend.name}`
                    : `add-${friend.name}`
                }
                onClick={() => handleChoose(friend)}
              >
                {chosenFriends.includes(friend) ? "x" : "+"}
              </button>
            </li>
          ))}
        </ul>
        <button data-testid="submit" onClick={handleGroupCreation}>
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
