import React from "react";

interface AnimatedBackgroundprops {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundprops> = ({
  children,
}) => {
  return (
    <div className="area grid place-items-center">
      <div className="text-white flex flex-col items-center justify-center gap-6 mx-4 z-10 h-full w-full">
        {children}
      </div>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default AnimatedBackground;
