import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import Login from "../user/Login";
import Signup from "../user/Signup";
import ResetPassword from "../user/ResetPassword";
import Button from "./Button";
import NavItem from "./NavItem";

import Background from "../assets/images/meshgradientbg.svg";

const Navigation = () => {
  const { isLoggedIn, logout } = useContext(UserContext);
  const [activeForm, setActiveForm] = useState("login");

  const showForm = (form) => {
    setActiveForm(form);
  };

  const handleSignupSuccess = () => {
    setActiveForm("login");
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
        <div className="p-10 flex items-center justify-center h-screen w-screen">
          <div
            className="flex desktop:flex-row phone:flex-col justify-center items-center desktop:h-[50svh] phone:h-auto desktop:w-[60rem] bg-cover gap-4"
            style={{ backgroundImage: `url(${Background})` }}
          >
            <div className="desktop:w-2/6 desktop:pr-5 phone:w-auto phone:p-10 border-stone-100 desktop:border-r-2 phone:border-0 text-secondary">
              <h1 className="text-2xl pb-5 font-bold">Welcome to PlusMinus</h1>
              <p>
                A neat web app that lets you track your expenses. You can track
                different categories of spending and set goals for your future
                spending.
              </p>
            </div>
            <div className="justify-center flex flex-col w-auto p-5">
              {activeForm === "login" && <Login />}
              {activeForm === "signup" && <Signup onSignupSuccess={handleSignupSuccess} />}
              {activeForm === "resetPassword" && <ResetPassword />}
              <div className="p-4 flex justify-center">
                {activeForm !== "resetPassword" && (
                  <Button
                    onClick={() => showForm(activeForm === "login" ? "signup" : "login")}
                    variant="secondary"
                    size="small"
                  >
                    {activeForm === "login" ? "Sign Up" : "Login"}
                  </Button>
                )}
                {activeForm === "login" && (
                  <Button
                    onClick={() => showForm("resetPassword")}
                    variant="secondary"
                    size="small"
                  >
                    Forgot Password?
                  </Button>
                )}
                {activeForm === "resetPassword" && (
                  <Button
                    onClick={() => showForm("login")}
                    variant="secondary"
                    size="small"
                  >
                    Back to Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;