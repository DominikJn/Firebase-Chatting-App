import React from "react";
import type UserData from "../types/UserData";
import { LiaUserFriendsSolid } from "react-icons/lia";
import {
  useGetUserQuery,
  useSendInviteMutation,
} from "../features/api/userApi";
import UserDocData from "../types/UserDocData";
import checkIfFriends from "../utils/checkIfFriends";

interface SearchFieldProps {
  searchedUser: UserData;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchedUser }) => {
  const user = useGetUserQuery().data as UserDocData;
  const [sendInvite] = useSendInviteMutation();

  const isFriend: boolean = checkIfFriends(user, searchedUser.id);

  return (
    <div className="flex justify-between border-solid border-b">
      <div>{searchedUser.name}</div>
      {isFriend ? (
        <LiaUserFriendsSolid data-testid="is-friend-icon" />
      ) : (
        <button
          onClick={() => sendInvite(searchedUser.id)}
          className="text-3xl"
        >
          +
        </button>
      )}
    </div>
  );
};

export default SearchField;
