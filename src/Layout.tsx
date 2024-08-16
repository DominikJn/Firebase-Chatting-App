import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Main>{children}</Main>
    </div>
  );
};

export default Layout;
