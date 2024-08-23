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
    updateUser({ ...user, lastSelectedChat: selectedChatId });
    //log out authenticated user
    await signOut(auth);
    //clear cached data
    dispatch(basicApi.util.resetApiState());
  }

  return (
    <header className="h-[80px] p-4 border-solid border-b text-white text-2xl flex justify-between items-center">
      <Link to={user ? "/chats" : "/"}>ChatApp</Link>
      {user && <Searchbar />}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="border-solid border rounded-full py-2 px-4"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="border-solid border rounded-full py-2 px-4"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border-solid border rounded-full py-2 px-4 bg-white text-slate-800"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
