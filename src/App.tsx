import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import { auth, db } from "./firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { login, logout } from "./features/userSlice";
import Navbar from "./components/Navbar";
import Chat from "./components/chat/Chat";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { setInvites } from "./features/invitesSlice";
import { setFriends } from "./features/friendsSlice";
import InviteList from "./components/lists/InviteList";
import FriendList from "./components/lists/FriendList";
import ChatList from "./components/lists/ChatList";
import Sidebar from "./components/Sidebar";
import StartingPage from "./pages/StartingPage";
import { selectChat } from "./features/chatsSlice";
import { setChats } from "./features/chatsSlice";
import type ChatData from "./types/ChatData";
import ChatListeners from "./components/listeners/ChatsListener";

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [chatIds, setChatIds] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        //fetch user data
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        dispatch(setInvites(docSnap.data()?.invites || []));
        dispatch(setFriends(docSnap.data()?.friends || []));
        dispatch(selectChat(docSnap.data()?.lastSelectedChat || ""));
        //fetch user chats
        const chatRef = collection(db, "chats");
        const queryChats = query(
          chatRef,
          where("userIds", "array-contains", user.uid)
        );
        const chatSnap = await getDocs(queryChats);
        const fetchedChats: ChatData[] = [];
        chatSnap.forEach((doc) =>
          fetchedChats.push({
            id: doc.id,
            users: doc.data().users,
            chatName: doc.data().chatName,
          })
        );
        const extractedChatIds = fetchedChats.map((chat) => chat.id)
        setChatIds(extractedChatIds);
        dispatch(setChats(fetchedChats));
        //login user
        dispatch(login({ name: user.displayName, uid: user.uid }));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      {user.name ? (
        <div className="h-full p-2 flex gap-2 *:bg-slate-900 *:rounded-lg">
          <Navbar />
          <Sidebar>
            <Routes>
              <Route path="/" element={<ChatList />} />
              <Route path="/friends" element={<FriendList />} />
              <Route path="/invites" element={<InviteList />} />
              <Route path="*" element={<ChatList />} />
            </Routes>
          </Sidebar>
          <ChatListeners chatIds={chatIds} />
          <Chat />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
