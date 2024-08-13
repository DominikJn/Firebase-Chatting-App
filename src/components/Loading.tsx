import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingProps {
  dark?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ dark }) => {
  return (
    <div className="w-full h-full grid place-items-center">
      <AiOutlineLoading3Quarters
        size={"30px"}
        color={dark ? '#0F172A' : 'white'}
        className="animate-spin-fast"
      />
    </div>
  );
};

export default Loading;
