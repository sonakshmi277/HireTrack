import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function SignInPage() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  useEffect(() => {
    const saveUserDetails = async () => {
      if (!user) return;

      try {
        await axios.post("http://localhost:5000/task_save", {
          email: user.email,
          fullName: user.name,
        });
        console.log("Details saved successfully");
      } catch (error) {
        console.log("Error saving details:", error);
      }
    };

    if (isAuthenticated) {
      saveUserDetails();
    }
  }, [isAuthenticated, user]);

  const handleLogin = (role) => {
    loginWithRedirect({
      appState: { role: role },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {!isAuthenticated ? (
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome to HireTrack !!</h2>
          <p>Select your role to continue:</p>
          <button style={styles.button} onClick={() => handleLogin("admin")}>
            Sign In as Admin
          </button>
          <button style={styles.button} onClick={() => handleLogin("job_searcher")}>
            Sign In as Job Searcher
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome, {user.name}!</h2>
          <p>You are now signed in</p>
          <button
            style={styles.logout}
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "16px",
  },
  button: {
    padding: "12px 20px",
    margin: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  logout: {
    padding: "10px 16px",
    marginTop: "20px",
    borderRadius: "8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
};
