import React from "react";

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="h-[calc(100%-80px)] p-2 flex justify-center gap-2 *:bg-slate-900 *:rounded-lg">
      {children}
    </main>
  );
};

export default Main;
