import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import type UserData from "../types/UserData";
import searchUser from "../utils/searchUser";
import SearchField from "./SearchField";

const Searchbar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<UserData[]>([]);
  const [isListVisible, setListVisible] = useState<boolean>(false);

  //set small timeout to prevent bluring from preventing sendInvite() click event
  const hideList = (): NodeJS.Timeout =>
    setTimeout(() => setListVisible(false), 200);
  const showList = (): NodeJS.Timeout =>
    setTimeout(() => setListVisible(true), 200);

  useEffect(() => {
    async function getSearchedUsers(): Promise<void> {
      const result = await searchUser(searchValue);
      setSearchedUsers(result);
    }
    if (searchValue) {
      getSearchedUsers();
      setListVisible(true);
    } else {
      setListVisible(false);
    }
  }, [searchValue]);

  return (
    <div className="flex items-center border-solid border py-2 px-3 rounded-full relative">
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        onFocus={showList}
        onBlur={hideList}
        type="text"
        className="bg-inherit outline-none"
      />
      <CiSearch />
      {isListVisible && (
        <div className="absolute top-[50px] left-0 w-full p-3 border-solid border bg-slate-900">
          {searchedUsers.map((searchedUser: UserData, index: number) => (
            <SearchField
              key={`${searchedUser.id}-${index}`}
              searchedUser={searchedUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
