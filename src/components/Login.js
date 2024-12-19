import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../utils/auth";
import InputField from "./InputField";
import "../styles/Auth.css";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/login", formData);
      setToken(response.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
 
    <div className="auth-container">
      <div class="box">
        <span class="borderLine"></span>
        <form onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <div class="inputBox">
            <input
              name="username"
              onChange={handleChange}
              label="Username"
              type="text"
              required="required"
            />
            <span>Username</span>
            <i></i>
          </div>
          <div class="inputBox">
            <input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              name="password"
            />
            <span>Password</span>
            <i></i>
          </div>
          {error && <p className="loginErrorMessage">{error}</p>}
          <div>
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>

  );
};

export default Login;
