import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Button from "../components/Button";

export default function Signup({ onSignupSuccess }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData(e.currentTarget);

    try {
      await axiosInstance.post("/user/signup", data);
      setSuccess("Redirecting to login shortly ...");
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess();
        }
        navigate("/login");
      }, 2500);
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        setError(error?.response?.data?.error?.message);
      } else {
        setError("An error occurred, try again later.");
      }
    }
  };

  return (
    <form id="auth_signup" className="flex flex-col gap-4" onSubmit={submit}>
      <h2 className="text-2xl text-secondary font-light">Create a new account</h2>
      <input name="name" type="text" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Your email" required />
      <input name="password" type="password" placeholder="***********" required />
      {error && <small style={{ color: "red" }}>{error}</small>}
      {success && <small style={{ color: "white" }}>{success}</small>}
      <Button showToast={true} toastText="User has been created" type="submit" variant="primary" size="big">
        Create account
      </Button>
    </form>
  );
}