import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import StartingPage from "./pages/StartingPage";
import { userApi } from "./features/api/userApi";
import { selectChat } from "./features/selectedChatSlice";
import { useDispatch } from "react-redux";
import Layout from "./Layout";
import Loading from "./components/Loading";
import PrivateRoutes from "./routes/PrivateRoutes";
import DashboardPage from "./pages/DashboardPage";
import PublicRoutes from "./routes/PublicRoutes";

const App: React.FC = () => {
  const { data, isLoading} = userApi.endpoints.getUser.useQuery(); //later in code the variable name is user to only access the data
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) dispatch(selectChat(data.lastSelectedChat));
  }, [data]);

  if (isLoading) return <Loading dark />;

  return (
    <Layout>
      <Routes>
        //private routes that require authentication
        <Route element={<PrivateRoutes user={data} />}>
          <Route path="/chats" element={<DashboardPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
        //public routes if user is not authenticated
        <Route element={<PublicRoutes user={data} />}>
          <Route path="/" element={<StartingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
