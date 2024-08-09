import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../store";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Searchbar from "./Searchbar";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();

  const handleLogout = async(): Promise<void> => await signOut(auth)

  return (
    <header className="h-[80px] p-4 border-solid border-b text-white text-2xl flex justify-between items-center">
      <div>ChatApp</div>
      {user.name && <Searchbar />}
      <div className="flex items-center gap-4">
        {user.name ? (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout} className="border-solid border rounded-full py-2 px-4">
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
