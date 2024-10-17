import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import StartingPage from "./pages/StartingPage";
import { useGetUserQuery, useUpdateUserMutation } from "./features/api/userApi";
import { selectChatId } from "./features/selectedChatIdSlice";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./Layout";
import Loading from "./components/Loading";
import PrivateRoutes from "./routes/PrivateRoutes";
import DashboardPage from "./pages/DashboardPage";
import PublicRoutes from "./routes/PublicRoutes";
import ChatList from "./components/lists/ChatList";
import InviteList from "./components/lists/InviteList";
import FriendList from "./components/lists/FriendList";
import UserDocData from "./types/UserDocData";
import { serverTimestamp } from "firebase/firestore";
import { RootState } from "./store";

const App: React.FC = () => {
  const selectedChatId = useSelector(
    (state: RootState) => state.selectedChatId.value
  );
  const { data: user, isLoading } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && selectChatId) {
      function setUserStatusOffline() {
        updateUser({
          ...user,
          lastSelectedChat: selectedChatId,
          status: { isActive: false, lastOnline: serverTimestamp() },
        } as UserDocData);
      }

      dispatch(selectChatId(user.lastSelectedChat));
      window.addEventListener("beforeunload", setUserStatusOffline);

      return () => {
        window.removeEventListener("beforeunload", setUserStatusOffline);
      };
    }
  }, [user, selectedChatId, dispatch]);

  useEffect(() => {
    dispatch(selectChatId(selectedChatId));
  }, [selectedChatId]);

  if (isLoading) return <Loading dark />;

  return (
    <Layout>
      <Routes>
        <Route element={<PrivateRoutes user={user} />}>
          <Route path="/" element={<DashboardPage />}>
            <Route path="/" element={<ChatList />} />
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
