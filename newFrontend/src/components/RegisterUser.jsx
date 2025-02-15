/* eslint-disable no-unused-vars */
import { useState } from "react";
import Input from "./Input.jsx";
import { Link, useNavigate } from "react-router";
import authService from "../backend/auth.config.js";
import errorTeller from "../backend/errorTeller.js";

function RegisterUser() {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    avatar: null,
    role: "user",
  });

  const [buttonData, setButtonData] = useState("Register");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setButtonData("Wait...");

    try {
      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", formData.avatar);
      data.append("role", formData.role);

      const user = await authService.registerUser(data);
      console.log(user);
      if (user) {
        alert("Account created successfully! You can now log in.");
        navigate("/user/login");
      }
    } catch (error) {
      setButtonData("Register");
      setError(errorTeller(error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md bg-gradient-to-b from-purple-700 bg-transparent text-white rounded-2xl shadow-xl p-8 mt-5 mx-2 mb-5">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Create Account
        </h2>
        <p className="mt-2 text-center text-base text-white/60">
          Already have an account?&nbsp;
          <Link
            to="/user/login"
            className="font-medium text-blue-400 transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form className="space-y-2" onSubmit={handleSubmit}>
          <Input
            required
            label="Username"
            name="userName"
            placeholder="Enter unique username"
            onChange={handleChange}
            value={formData.userName}
          />

          <Input
            required
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            onChange={handleChange}
            value={formData.fullName}
          />

          <Input
            required
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={formData.email}
          />

          <Input
            required
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
          />

          <Input
            required
            type="file"
            label="Avatar"
            name="avatar"
            onChange={handleChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />

          <div>
            <label className="block text-white mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-xl bg-blue-700 text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

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

export default RegisterUser;
