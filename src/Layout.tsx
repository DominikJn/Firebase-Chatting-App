import React from "react";
import Header from "./components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="h-[calc(100%-80px)] p-2 flex justify-center gap-2 *:bg-slate-900 *:rounded-lg">
        {children}
      </main>
    </div>
  );
};

export default Layout;
