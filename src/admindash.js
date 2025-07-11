import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./common.css";

export default function Admindash() {
  const navigate = useNavigate();
  const { logout } = useAuth0();  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications");
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error("Error updating status:", err);
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
            <h5 onClick={() => navigate("/admindash")}>Dashboard</h5>
            <h5 onClick={() => navigate("/postNew")}>Post New Job</h5>
            <h5 onClick={() => navigate("/jobPosted")}>Jobs Posted</h5>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Education</th>
                  <th>Position</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>{app.name || "-"}</td>
                    <td>{app.email || app.seekerEmail || "-"}</td>
                    <td>{app.age || "-"}</td>
                    <td>{app.education || "-"}</td>
                    <td>{app.jobId?.title} at {app.jobId?.company}</td>
                    <td>
                      {app.resume ? (
                        <a
                          href={`http://localhost:5000/uploads/${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      ) : "N/A"}
                    </td>
                    <td>
                      <span className={`status ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status !== "Accepted" && (
                        <button onClick={() => updateStatus(app._id, "Accepted")}>
                          Approve
                        </button>
                      )}
                      {app.status !== "Rejected" && (
                        <button onClick={() => updateStatus(app._id, "Rejected")}>
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
