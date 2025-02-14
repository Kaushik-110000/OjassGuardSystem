/* eslint-disable no-unused-vars */
import { useState } from "react";
import Input from "./Input.jsx";
import { Link, useNavigate } from "react-router";
import authService from "../backend/auth.config.js";
import errorTeller from "../backend/errorTeller.js";

function RegisterGuard() {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    avatar: null,
    residence: "",
    description: "",
    workHistory: [],
    age: "",
  });

  const [workHistory, setWorkHistory] = useState({
    location: "",
    duration: "",
    description: "",
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

  const handleWorkHistoryChange = (e) => {
    const { name, value } = e.target;
    setWorkHistory({ ...workHistory, [name]: value });
  };

  const addWorkHistory = () => {
    if (
      workHistory.location &&
      workHistory.duration &&
      workHistory.description
    ) {
      setFormData({
        ...formData,
        workHistory: [...formData.workHistory, workHistory],
      });
      setWorkHistory({ location: "", duration: "", description: "" });
    }
  };

  const removeWorkHistory = (index) => {
    const updatedWorkHistory = formData.workHistory.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, workHistory: updatedWorkHistory });
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
      data.append("residence", formData.residence);
      data.append("description", formData.description);
      data.append("age", formData.age);
      data.append("workHistory", JSON.stringify(formData.workHistory)); // Send as JSON string

      const user = await authService.registerGuard(data);
      if (user) {
        alert("Account created successfully! You can now log in.");
        navigate("/guard/login");
      }
    } catch (error) {
      setButtonData("Register");
      setError(errorTeller(error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-gradient-to-b from-purple-700 bg-transparent text-white rounded-2xl shadow-xl p-8 mt-5 mx-2 mb-5">
        <h2 className="text-3xl font-semibold text-center">Create Account</h2>
        <p className="mt-2 text-center text-base text-white/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-blue-400 transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <Input
            label="Residence"
            name="residence"
            placeholder="Enter your residence"
            onChange={handleChange}
            value={formData.residence}
          />

          <Input
            label="Age"
            type="number"
            name="age"
            placeholder="Enter your age"
            onChange={handleChange}
            value={formData.age}
          />

          <Input
            label="Description"
            name="description"
            placeholder="Brief description about yourself"
            onChange={handleChange}
            value={formData.description}
          />

          {/* Work History Section */}
          <div className=" rounded-lg">
            <h3 className=" font-semibold mb-2">Work History</h3>

            <Input
              label="Location"
              name="location"
              placeholder="Enter work location"
              onChange={handleWorkHistoryChange}
              value={workHistory.location}
            />

            <Input
              label="Duration"
              name="duration"
              placeholder="Enter duration (e.g., 2 years)"
              onChange={handleWorkHistoryChange}
              value={workHistory.duration}
            />

            <Input
              label="Description"
              name="description"
              placeholder="Describe your work"
              onChange={handleWorkHistoryChange}
              value={workHistory.description}
            />

            <button
              type="button"
              onClick={addWorkHistory}
              className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white py-1 px-3 rounded-xl transition duration-200"
            >
              Add Work History
            </button>

            {formData.workHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-black font-medium">Previous Work</h4>
                <ul className="list-disc text-black pl-5">
                  {formData.workHistory.map((job, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {job.location} ({job.duration}): {job.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeWorkHistory(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

export default RegisterGuard;
