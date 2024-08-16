import React from "react";
import { Navigate, Outlet } from "react-router";
import UserData from "../types/UserData";

interface PublicRoutesProps {
  user: UserData | null | undefined;
}

const PublicRoutes: React.FC<PublicRoutesProps> = ({ user }) => {
  return !user ? <Outlet /> : <Navigate to="/chats" />;
};

export default PublicRoutes;
