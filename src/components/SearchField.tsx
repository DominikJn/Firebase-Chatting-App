import React, { useEffect, useState } from "react";
import type UserData from "../types/UserData";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { db } from "../firebase-config";
import { LiaUserFriendsSolid } from "react-icons/lia";

interface SearchFieldProps {
  searchedUser: UserData;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchedUser }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const friends = useSelector((state: RootState) => state.friends.value);
  const [isFriend, setFriend] = useState<boolean>(false);

  useEffect(() => {
    setFriend(checkIfFriends());
  }, []);

  function checkIfFriends(): boolean {
    //prevent user from inviting himself
    if (searchedUser.id === user.uid) return true;

    for (let friend of friends) {
      if (searchedUser.id === friend.id) return true;
    }

    return false;
  }

  async function sendInvite(searchedUser: UserData): Promise<void> {
    const userRef = doc(db, "users", searchedUser.id);
    await updateDoc(userRef, {
      invites: arrayUnion({ name: user.name, id: user.uid }),
    });
  }

  return (
    <div className="flex justify-between border-solid border-b">
      <div>{searchedUser.name}</div>
      {isFriend ? (
        <LiaUserFriendsSolid />
      ) : (
        <button onClick={() => sendInvite(searchedUser)} className="text-3xl">
          +
        </button>
      )}
    </div>
  );
};

export default SearchField;
