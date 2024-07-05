import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"
import Button from "../components/Button";


export default function Signup({onSignupSuccess}) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    try {
      await axiosInstance.post("/user/signup", data);
      setTimeout(() => {
        nav("/login");
      }, 4000);
    } catch (e) {
      if (e?.response?.data?.error?.message) {
        setError(e?.response?.data?.error?.message);
      } else {
        setError("An Error occured, try again later");
      }
    }
  };

  return (
    <form id="auth" className="flex flex-col gap-4" onSubmit={submit}>
      <h2 className="text-2xl text-secondary font-light">Create a new account</h2>
      <input name="name" type="text" placeholder="Your name" />
      <input name="email" type="text" placeholder="your email" />
      <input name="password" type="password" placeholder="***********" />
      {error && <small style={{ color: "red" }}>{error}</small>}
      <Button type="submit" variant="primary" size="big">Create account</Button>
    </form>
  );
}
