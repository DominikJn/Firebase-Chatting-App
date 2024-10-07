import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  handleClick: () => void;
  altStyle?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, handleClick, altStyle }) => {
  return (
    <button
      onClick={handleClick}
      className={`border-solid border rounded-full py-2 px-4 ${
        altStyle && "bg-white text-slate-800"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
