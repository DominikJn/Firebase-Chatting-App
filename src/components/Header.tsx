import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Searchbar from "./Searchbar";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../features/api/userApi";
import { basicApi } from "../features/api/basicApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import UserDocData from "../types/UserDocData";
import Button from "./Button";
import { serverTimestamp } from "firebase/firestore";

const Header: React.FC = () => {
  const user = useGetUserQuery().data as UserDocData;
  const [updateUser] = useUpdateUserMutation();
  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    //update last selected chat in user doc
    updateUser({
      ...user,
      lastSelectedChat: selectedChatId,
      status: { isActive: false, lastOnline: serverTimestamp() },
    });
    //log out authenticated user
    await signOut(auth);
    //clear cached data
    dispatch(basicApi.util.resetApiState());
  }

  return (
    <header className="h-[80px] p-4 border-solid border-b text-white text-2xl flex justify-between items-center">
      <Link to="/">ChatApp</Link>
      {user && <Searchbar />}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.name}</span>
            <Button handleClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button handleClick={() => navigate("/login")}>Sign In</Button>
            <Button handleClick={() => navigate("/register")} altStyle>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
