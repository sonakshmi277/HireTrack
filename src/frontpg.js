import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./frontpage.css";

export default function Frontpg() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const saveUserDetails = async () => {
      if (!user || !user.email) return; 

      try {
        const response = await axios.post("http://localhost:5000/task_save", {
          email: user.email,
          fullName: user.name || user.nickname || "User", 
        });
        console.log("User details saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving user details to backend:", error.response ? error.response.data : error.message);
      }
    };

    if (isAuthenticated) {
      saveUserDetails();
    }
  }, [isAuthenticated, user]); 
  const handleAuth = (role, screenHint = 'login') => {
    loginWithRedirect({
      appState: { role: role },
      authorizationParams: {
        screen_hint: screenHint, 
      },
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading authentication... please wait!</p>
      </div>
    );
  }

  return (
    <div className="signin-container">
      {!isAuthenticated ? (
        <div className="signin-card">
          <h2 className="welcome-heading">Welcome to HireTrack!</h2>
          <p className="welcome-message">Select your role to get started:</p>

          <div className="button-group">
            <button className="auth-button" onClick={() => handleAuth("admin", "login")}>
              Sign In as Admin 
            </button>
            <button className="auth-button" onClick={() => handleAuth("job_searcher", "login")}>
              Sign In as Job Seeker 
            </button>
          </div>

          <p className="signup-prompt">
            New here? Join us!
          </p>
          <div className="button-group">
             <button className="auth-button signup-button" onClick={() => handleAuth("admin", "signup")}>
                Sign Up as Admin 
            </button>
            <button className="auth-button signup-button" onClick={() => handleAuth("job_searcher", "signup")}>
                Sign Up as Job Seeker 
            </button>
          </div>
        </div>
      ) : (
        <div className="signin-card">
          <h2 className="welcome-heading">Welcome, {user.name || user.nickname || 'User'}!</h2>
          <p className="signed-in-message">You are now successfully signed in!</p>
          <button
            className="logout-button"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log Out 
          </button>
          <button
            className="dashboard-link-button"
            onClick={() => navigate("/admindash")} 
          >
            Go to Dashboard 
          </button>
        </div>
      )}
    </div>
  );
}