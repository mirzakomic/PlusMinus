import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import { UserContext } from "./providers/UserContext";

// Routes
import Home from "./pages/Home";
import Signup from "./user/Signup";
import Login from "./user/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Goals from "./pages/Goals";

import "./App.css";
import ResetPassword from "./user/ResetPassword";
import VerifyEmail from "./components/verifyMail";

import Navigation from "./components/Navigation";

function App() {
  const { isLoggedIn, logout } = useContext(UserContext);

  return (
    <div className="max-w-4xl mx-auto my-0">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/passwordReset" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
