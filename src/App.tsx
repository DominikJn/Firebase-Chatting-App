import React, { useEffect } from "react";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import { auth } from "./firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { login, logout } from "./features/userSlice";

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ name: user.displayName, uid: user.uid }));
      } else {
        dispatch(logout())
      }
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 h-screen w-screen flex flex-col">
      <Header />
      {user.name ? (
        <h1 className="text-white">{user.name} is logged!</h1>
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
