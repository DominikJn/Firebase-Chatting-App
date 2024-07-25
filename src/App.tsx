import React, { useEffect } from "react";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import { auth, db } from "./firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { login, logout } from "./features/userSlice";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import { doc, getDoc } from "firebase/firestore";
import { setInvites } from "./features/invitesSlice";
import { setFriends } from "./features/friendsSlice";
import InviteList from "./components/lists/InviteList";
import FriendList from "./components/lists/FriendList";
import ChatList from "./components/lists/ChatList";

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userRef)
        dispatch(setInvites(docSnap.data()?.invites))
        dispatch(setFriends(docSnap.data()?.friends))
        dispatch(login({ name: user.displayName, uid: user.uid }));
      } else {
        dispatch(logout())
      }
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-screen w-screen flex flex-col">
      <Header />
      {user.name ? (
        <div className="h-full p-2 flex gap-2 *:bg-slate-900 *:rounded-lg">
          <Navbar />
          <Routes>
            <Route path="/" element={<ChatList />} />
            <Route path="/friends" element={<FriendList />} />
            <Route path="/invites" element={<InviteList />} />
            <Route path="*" element={<ChatList />} />
          </Routes>
          <Chat />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
