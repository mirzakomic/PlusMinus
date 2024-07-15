import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";

import NavItem from "./NavItem";
import Loader from "./Loader";
import Authorization from "../pages/Authorization"

import Background from "../assets/images/meshgradientbg.svg";

const Navigation = () => {
  const { isLoggedIn, logout, isLoading } = useContext(UserContext);

  if (isLoading) return <Loader />;

  return (
      isLoggedIn ?
        (
          <nav className="bg-black p-5 rounded-3xl shadow-md text-2xl fixed bottom-5 left-0 right-0 mx-auto max-w-screen-md">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center gap-5">
                <NavItem to="/dashboard">Dashboard</NavItem>
                <NavItem to="/stats">Statistics</NavItem>
                <NavItem to="/goals">Goals</NavItem>
              </div>
              <div className="flex items-center gap-5">
                <NavItem to="/profile">Profile</NavItem>
                <NavItem to="/" onClick={logout}>Logout</NavItem>
              </div>
            </div>
          </nav> ) : (
          <Authorization />
        )
  );
};

export default Navigation;