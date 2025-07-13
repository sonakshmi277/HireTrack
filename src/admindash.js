import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./common.css";

export default function Admindash() {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [applications, setApplications] = useState([]);
  const [totalJobsPostedCount, setTotalJobsPostedCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
      setPendingReviewCount(data.filter(app => app.status === 'Pending').length);

    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]); 
      setPendingReviewCount(0);
    }
  }, []); 
  useEffect(() => {
    const fetchTotalJobsPosted = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/count');
        if (res.status !== 200) throw new Error("Failed to fetch jobs posted count");
        setTotalJobsPostedCount(res.data.count); 
      } catch (err) {
        console.error("Error fetching total jobs posted:", err.message);
        setTotalJobsPostedCount(0); 
      }
    };
    fetchTotalJobsPosted();
  }, []); 
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchApplications(); 
      } else {
        const errorData = await response.json();
        console.error("Error updating status:", errorData.error);
        alert(`Failed to update status: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("An error occurred while updating status.");
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
            <h2>Total Jobs Posted</h2>
            <h4>{totalJobsPostedCount}</h4>
          </div>
          <div className="admin-box">
            <h2>Pending Review</h2>
            <h4>{pendingReviewCount}</h4>
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