import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import createChatDoc from "../../utils/createChatDoc";

interface CreateGroupModalProps {
  setModalOpen: (arg: boolean) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  setModalOpen,
}) => {
  const user = useSelector((state: RootState) => state.user.value);
  const friends = useSelector((state: RootState) => state.friends.value);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<UserData[]>([]);
  const [chosenFriends, setChosenFriends] = useState<UserData[]>([]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.name.includes(searchValue.toLowerCase())
      )
    );
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

  async function handleGroupCreation(): Promise<void> {
    //create chat with chosen friends
    const finalUsers = [...chosenFriends, { name: user.name, id: user.uid }];
    if (finalUsers.length > 2) {
      //create document in chats
      await createChatDoc(finalUsers, "group");
    } else {
      console.log(
        "In order to create a group there must be more than 2 members!"
      );
    }
  }

  return (
    <div className="absolute left-0 top-0 bg-black/40 text-white h-full w-full grid place-items-center">
      <div className="bg-slate-800 w-1/3 h-1/2 p-4 flex flex-col gap-4">
        <button onClick={() => setModalOpen(false)}>X</button>
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
              <button onClick={() => handleChoose(friend)}>
                {chosenFriends.includes(friend) ? "x" : "+"}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleGroupCreation}>Create Group</button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
