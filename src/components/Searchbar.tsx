import {
  collection,
  endAt,
  getDocs,
  orderBy,
  startAt,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { auth, db } from "../firebase-config";
import type UserData from "../types/UserData";
import SearchField from "./SearchField";

const Searchbar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isListVisible, setListVisible] = useState<boolean>(false);
  //set small timeout to prevent bluring from preventing sendInvite() click event
  const hideList = (): NodeJS.Timeout => setTimeout(() => setListVisible(false), 200);
  const showList = (): NodeJS.Timeout => setTimeout(() => setListVisible(true), 200);

  useEffect(() => {
    if (searchValue) search();

    searchValue ? setListVisible(true) : setListVisible(false);
  }, [searchValue]);

  async function search() {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          orderBy("name"),
          startAt(searchValue),
          endAt(searchValue + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setUserList(fetchedUsers);
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }

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
          {userList.map((searchedUser: UserData, index: number) => (
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
