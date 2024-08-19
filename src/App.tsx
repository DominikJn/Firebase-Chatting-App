import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import StartingPage from "./pages/StartingPage";
import { useGetUserQuery } from "./features/api/userApi";
import { selectChat } from "./features/selectedChatSlice";
import { useDispatch } from "react-redux";
import Layout from "./Layout";
import Loading from "./components/Loading";
import PrivateRoutes from "./routes/PrivateRoutes";
import DashboardPage from "./pages/DashboardPage";
import PublicRoutes from "./routes/PublicRoutes";
import ChatList from "./components/lists/ChatList";
import InviteList from "./components/lists/InviteList";
import FriendList from "./components/lists/FriendList";

const App: React.FC = () => {
  const { data: user, isLoading } = useGetUserQuery(); //later in code the variable name is user to only access the data
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(selectChat(user.lastSelectedChat));
  }, [user]);

  if (isLoading) return <Loading dark />;

  return (
    <Layout>
      <Routes>
        <Route element={<PrivateRoutes user={user} />}>
          <Route path="/" element={<DashboardPage />}>
            <Route path="/chats" element={<ChatList />} />
            <Route path="/friends" element={<FriendList />} />
            <Route path="/invites" element={<InviteList />} />
            <Route path="*" element={<ChatList />} />
          </Route>
          <Route path="*" element={<div>ErrorPage!</div>} />
        </Route>
        //public routes if user is not authenticated
        <Route element={<PublicRoutes user={user} />}>
          <Route path="/welcome" element={<StartingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
