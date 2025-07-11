import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./common.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth0(); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/userApplications?email=sonakshmib@gmail.com");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="admin-main">
      <div className={`${isCollapsed ? "admin-sidebar-collapsed" : "admin-sidebar"}`}>
        <button className="admin-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {!isCollapsed ? "☰" : "✖"}
        </button>
        {!isCollapsed && (
          <div className="admin-menu-items">
            <h5 onClick={() => navigate("/userDashboard")}>Dashboard</h5>
            <h5 onClick={() => navigate("/applyNew")}>Apply</h5>
            <h5 onClick={() => navigate("/message")}>Messages</h5>
            <h5
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Log Out
            </h5>
          </div>
        )}
      </div>

      <div className="admin-content">
        <div className="admin-boxes">
          <div className="admin-box">
            <h2>Total Job Applications</h2>
            <h4>{applications.length}</h4>
          </div>
          <div className="admin-box">
            <h2>Active Users</h2>
            <h4>50</h4>
          </div>
          <div className="admin-box">
            <h2>Jobs Posted</h2>
            <h4>25</h4>
          </div>
          <div className="admin-box">
            <h2>Application</h2>
            <h4>Trends</h4>
          </div>
        </div>

        <div className="admin-table-container">
          <h2>Recent Job Applications</h2>
          {applications.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.jobId?.title || "Unknown"}</td>
                    <td>{app.jobId?.company || "Unknown"}</td>
                    <td>
                      <span className={`status ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applications found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
