import React from "react";

const Header: React.FC = () => {
  return (
    <header className="p-4 border-solid border-b text-white text-2xl flex justify-between items-center">
      <div>ChatApp</div>
      <div className="flex gap-4">
        <button className="border-solid border rounded-full py-2 px-4">
          Sign In
        </button>
        <button className="border-solid border rounded-full py-2 px-4 bg-white text-slate-800">
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
