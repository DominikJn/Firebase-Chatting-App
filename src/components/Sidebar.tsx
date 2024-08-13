import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="min-w-[15%] max-w-[15%] rounded-lg text-white overflow-x-hidden overflow-y-auto">
      {children}
    </aside>
  );
};

export default Sidebar;
