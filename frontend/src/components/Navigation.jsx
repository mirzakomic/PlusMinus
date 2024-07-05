import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../providers/UserContext";
import Login from "../user/Login";
import Signup from "../user/Signup";
import Button from "./Button";
import NavItem from "./NavItem";

const Navigation = () => {
  const { isLoggedIn, logout } = useContext(UserContext);
  const [showForm, setShowForm] = useState(true);

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  const handleSignupSuccess = () => {
    setShowForm(true);
  };

  return (
         <>
      {isLoggedIn && (
        <nav className="bg-paleLilac p-5 rounded-3xl shadow-md text-2xl font-poppinsRegular flex justify-between">
          <div className="flex items-center gap-5 mr-5">
          <NavItem to="/profile">Profile</NavItem>
          <NavItem to="/" onClick={logout}>Logout</NavItem>
      </div>
    </nav>
)}
{!isLoggedIn && (
  <>
  <div className="flex flex-col justify-center items-center gap-4 h-screen">
        {showForm ? <Login/> : <Signup onSignupSuccess={handleSignupSuccess}/>}
      <Button onClick={toggleForm} variant="tertiary">
        {showForm ? "You want to sign up rather?" : "Login?"}
      </Button>
</div>
</>
)}
    </>
  );
};

export default Navigation;