import axios from "axios";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../providers/UserContext";
import axiosInstance from "../utils/axiosInstance";
import Button from "../components/Button";

export default function Login() {
  const { refetch } = useContext(UserContext);
  const nav = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    try {
      await axiosInstance.post("/user/login", data);
      refetch();
      console.log("navigiert jetzt");
      nav("/");
    } catch (e) {
      console.log(e);
      setError("An Error occured, try again later");
    }
  };

  return (
    <form id="auth" className="flex flex-col gap-4" onSubmit={submit}>
      <h2 className="text-2xl text-secondary font-light">Log in with your account</h2>
      <input name="email" type="email" placeholder="your email" />
      <input name="password" type="password" placeholder="***********" />
      {error && <small style={{ color: "red" }}>{error}</small>}
      <Button type="submit" variant="primary" size="big">Login</Button>
      {/* <Link className="text-secondary" to={"/resetPassword"}>Forgot password?</Link> */}
    </form>
  );
}
