import React from "react"
import Header from "./components/Header"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Route, Routes } from "react-router"

const App: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 h-screen w-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
