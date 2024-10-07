import React from "react";
import { FaArrowDown } from "react-icons/fa";

interface ScrollDownButtonProps {
  scrollDown: () => void;
}

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({ scrollDown }) => {
  return (
    <button
      data-testid="scrollDownButton"
      onClick={scrollDown}
      className="fixed bottom-[20%] bg-slate-900 text-3xl text-white p-2 rounded-full animate-bounce"
    >
      <FaArrowDown />
    </button>
  );
};

export default ScrollDownButton;
