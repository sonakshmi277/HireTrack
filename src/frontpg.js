import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./frontpage.css";

export default function Frontpg() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); 
  const [isLogin, setIsLogin] = useState(true); 

  const handleAuth = async () => {
    if (!selectedRole) {
      alert("Please select a role first!");
      return;
    }

    try {
      const url = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/signup";

      const response = await axios.post(url, {
        email,
        password,
        fullName: !isLogin ? fullName : undefined,
        role: selectedRole
      });

      const { token, user } = response.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("selectedRole", selectedRole);
      if (selectedRole === "admin") navigate("/admindash");
      else navigate("/userDashboard");

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="welcome-heading">Welcome to HireTrack!</h2>
        <p className="welcome-message">Select your role to get started:</p>

        <div className="button-group">
          <button
            className={`auth-button ${selectedRole === "admin" ? "selected" : ""}`}
            onClick={() => setSelectedRole("admin")}
          >
            Admin
          </button>
          <button
            className={`auth-button ${selectedRole === "job_searcher" ? "selected" : ""}`}
            onClick={() => setSelectedRole("job_searcher")}
          >
            Job Seeker
          </button>
        </div>

        <p className="auth-toggle-text">
          {isLogin ? "Login" : "Sign Up"} for {selectedRole || "your role"}
        </p>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="toggle-text"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "New here? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
