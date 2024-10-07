import React from "react";
import type UserData from "../types/UserData";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { useGetUserQuery } from "../features/api/userApi";
import UserDocData from "../types/UserDocData";
import checkIfFriends from "../utils/checkIfFriends";

interface SearchFieldProps {
  searchedUser: UserData;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchedUser }) => {
  const user = useGetUserQuery().data as UserDocData;
  const isFriend: boolean = checkIfFriends(user, searchedUser.id);

  async function sendInvite(searchedUser: UserData): Promise<void> {
    const userRef = doc(db, "users", searchedUser.id);
    await updateDoc(userRef, {
      invites: arrayUnion({ name: user.name, id: user.id }),
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
