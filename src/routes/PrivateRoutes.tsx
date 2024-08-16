import React from "react";
import { Navigate, Outlet } from "react-router";
import UserData from "../types/UserData";

interface PrivateRoutesProps {
  user: UserData | null | undefined;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
