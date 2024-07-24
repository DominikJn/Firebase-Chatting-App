import React from "react";
import { useNavigate } from "react-router";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="p-4 border-solid border-b text-white text-2xl flex justify-between items-center">
      <div>ChatApp</div>
      <div className="flex gap-4">
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
      </div>
    </header>
  );
};

export default Header;
