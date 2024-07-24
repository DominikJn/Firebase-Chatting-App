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

interface UserList {
  id: string;
  name: string;
}

const Searchbar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [userList, setUserList] = useState<UserList[]>([]);
  const [isListVisible, setListVisible] = useState<boolean>(false);
  const hideList = (): void => setListVisible(false);
  const showList = (): void => setListVisible(true);

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

  useEffect(() => {
    if (searchValue) search();

    searchValue ? setListVisible(true) : setListVisible(false);
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
            {userList.map((user, index) => (
                <div key={`${user.id}-${index}`}>{user.name}</div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
