import React from "react";
import type UserData from "../types/UserData";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { db } from "../firebase-config";

interface SearchFieldProps {
  searchedUser: UserData;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchedUser }) => {
  const user = useSelector((state: RootState) => state.user.value);

  async function sendInvite(searchedUser: UserData): Promise<void> {
    const userRef = doc(db, "users", searchedUser.id);
    await updateDoc(userRef, {
      invites: arrayUnion({ name: user.name, id: user.uid }),
    });
  }

  return (
    <div className="flex justify-between border-solid border-b">
      <div>{searchedUser.name}</div>
      <button onClick={() => sendInvite(searchedUser)} className="text-3xl">
        +
      </button>
    </div>
  );
};

export default SearchField;
