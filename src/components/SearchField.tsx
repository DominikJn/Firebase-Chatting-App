import React, { useEffect, useState } from "react";
import type UserData from "../types/UserData";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { useGetUserQuery } from "../features/api/userApi";

interface SearchFieldProps {
  searchedUser: UserData;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchedUser }) => {
  const [isFriend, setFriend] = useState<boolean>(false);
  const user = useGetUserQuery().data;

  useEffect(() => {
    setFriend(checkIfFriends());
  }, []);

  function checkIfFriends(): boolean {
    if (user) {
      //prevent user from inviting himself
      if (searchedUser.id === user.id) return true;

      for (let friend of user.friends) {
        if (searchedUser.id === friend.id) return true;
      }
    }
    return false;
  }

  async function sendInvite(searchedUser: UserData): Promise<void> {
    const userRef = doc(db, "users", searchedUser.id);
    await updateDoc(userRef, {
      invites: arrayUnion({ name: user?.name, id: user?.id }),
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
