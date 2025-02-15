import { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";
import authService from "../backend/auth.config.js";
import errorTeller from "../backend/errorTeller.js";

function LoginGuard() {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonData, setButtonData] = useState("Login");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setButtonData("Wait...");

    try {
      const formData = { userName, email, password };
      await authService.loginGuard(formData);

      const user = await authService.getCurrentGuard();
      
      if (user) {
        dispatch(storeLogin({ userData: user }));
        setUserName("");
        setEmail("");
        setPassword("");
        navigate(`/guard/g/${user.userName}`);
      }
    } catch (error) {
      setButtonData("Login");
      setError(errorTeller(error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-500 via-purple-700 bg-transparent text-white rounded-2xl shadow-xl mx-2 p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
        <p className="mt-2 text-center text-base text-white/60">
          Don't have an account?&nbsp;
          <Link
            to="/guard/register"
            className="font-medium text-blue-400 transition-all duration-200 hover:underline"
          >
            Create
          </Link>
        </p>

        {error && (
          <div className="text-red-600 text-center p-2 rounded mb-4">
            {error}
          </div>
        )}

        <p className="text-center text-blue-300">
          Enter either username or email
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="userName"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <Input
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            required
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-500 text-white py-2 px-4 rounded-xl transition duration-200"
          >
            {buttonData}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginGuard;
