import React, { useEffect } from "react";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Chat from "./components/chat/Chat";
import InviteList from "./components/lists/InviteList";
import FriendList from "./components/lists/FriendList";
import ChatList from "./components/lists/ChatList";
import Sidebar from "./components/Sidebar";
import StartingPage from "./pages/StartingPage";
import { userApi } from "./features/api/userApi";
import { selectChat } from "./features/selectedChatSlice";
import { useDispatch } from "react-redux";
import Layout from "./Layout";
import Main from "./components/Main";

const App: React.FC = () => {
  const user = userApi.endpoints.getUser.useQuery().data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(selectChat(user.lastSelectedChat));
  }, [user]);

  return (
    <Layout>
      <Header />
      {user ? (
        <Main>
          <Navbar />
          <Sidebar>
            <Routes>
              <Route path="/" element={<ChatList />} />
              <Route path="/friends" element={<FriendList />} />
              <Route path="/invites" element={<InviteList />} />
              <Route path="*" element={<ChatList />} />
            </Routes>
          </Sidebar>
          <Chat />
        </Main>
      ) : (
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </Layout>
  );
};

export default App;
