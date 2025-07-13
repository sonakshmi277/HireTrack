import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./common.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth0();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [applications, setApplications] = useState([]);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [applicationsReviewedCount, setApplicationsReviewedCount] = useState(0);
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      axios.post("http://localhost:5000/api/register", {
        email: user.email,
        fullName: user.name
      })
      .then(res => console.log("Registered / existing jobseeker:", res.data))
      .catch(err => console.error("Registration failed:", err));
    }
  }, [user, isAuthenticated]);

  const fetchUserApplications = useCallback(async () => {
    try {
      if (!isAuthenticated || !user?.email) {
        console.warn("User not authenticated or email not available. Cannot fetch applications.");
        setApplications([]);
        return;
      }
      const res = await fetch(`http://localhost:5000/api/userApplications?email=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
      const pending = data.filter(app => app.status === 'Pending').length;
      setPendingApplicationsCount(pending);
      const reviewed = data.filter(app => app.status !== 'Pending').length;
      setApplicationsReviewedCount(reviewed);

    } catch (err) {
      console.error("Error fetching user applications:", err.message);
      setApplications([]);
      setPendingApplicationsCount(0);
      setApplicationsReviewedCount(0);
    }
  }, [user?.email, isAuthenticated]);
  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  const handleApplyButtonClick = async () => {
    if (!isAuthenticated || !user?.email) {
        alert("Please log in to apply for jobs.");
        return;
    }

    try {
        const userEmail = user.email;

        const checkUserResponse = await axios.get(`http://localhost:5000/api/checkUser?email=${userEmail}`);
        const checkUserData = checkUserResponse.data;

        if (checkUserData.exists) {
            const currentUserInfo = checkUserData.user;
            const availableJobs = checkUserData.jobs;

            const confirmUpdate = window.confirm(
                "We found your previous application data. Do you want to make any changes to your profile (Name, Age, Education, Resume)?\n\n" +
                "Click 'OK' to update your data manually on the form.\n" +
                "Click 'Cancel' to auto-apply using your existing saved data."
            );

            if (confirmUpdate) {
                console.log("User chose to update. Navigating to apply page for manual update.");
                navigate('/applyNew', { state: { userData: currentUserInfo, mode: 'update' } });
            } else {
                console.log("User chose to auto-apply with existing data.");

                if (!availableJobs || availableJobs.length === 0) {
                    alert("No previous jobs found to auto-apply to. Please choose 'OK' to fill a new application.");
                    navigate('/applyNew', { state: { mode: 'new' } });
                    return;
                }

                let jobOptionsPrompt = "Select a job to auto-apply:\n\n";
                availableJobs.forEach((job, index) => {
                    jobOptionsPrompt += `${index + 1}. ${job.title} at ${job.company}\n`;
                });

                const selectedJobChoice = window.prompt(jobOptionsPrompt + "\nEnter the number:");

                if (selectedJobChoice === null) {
                    alert("Auto-application cancelled.");
                    return;
                }

                const jobIndex = parseInt(selectedJobChoice) - 1;
                if (isNaN(jobIndex) || jobIndex < 0 || jobIndex >= availableJobs.length) {
                    alert("Invalid job selection. Please enter a valid number from the list.");
                    return;
                }

                const selectedJob = availableJobs[jobIndex];

                const autoApplyData = new FormData();
                autoApplyData.append("name", currentUserInfo.Name);
                autoApplyData.append("email", currentUserInfo.Email);
                autoApplyData.append("age", currentUserInfo.Age);
                autoApplyData.append("education", currentUserInfo.Education);
                autoApplyData.append("jobId", selectedJob._id);
                autoApplyData.append("updateExisting", "false");

                console.log("Sending auto-apply request:", { email: currentUserInfo.Email, jobId: selectedJob._id });

                const response = await axios.post('http://localhost:5000/api/apply', autoApplyData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                if (response.status === 200) {
                    const contentType = response.headers['content-type'];
                    if (contentType && contentType.includes('application/json')) {
                        const responseJson = response.data;
                        alert(responseJson.message || "Application auto-submitted successfully!");
                    } else {
                        alert("Application auto-submitted successfully!");
                    }
                    await fetchUserApplications(); 
                } else {
                    const errorText = response.data.error || "Unknown error";
                    alert(`Auto-application failed: ${errorText}`);
                }
            }
        } else {
            console.log("New user. Navigating to apply page for manual fill.");
            navigate('/applyNew', { state: { mode: 'new' } });
        }
    } catch (error) {
        console.error("Error in handleApplyButtonClick:", error);
        if (error.response) {
            const errorMessage = error.response.data?.error || error.message || 'Unknown error';
            alert(`Error: ${errorMessage}`);
        } else {
            alert("An unexpected error occurred. Please try again. Check console for details.");
        }
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
            <h5 onClick={handleApplyButtonClick}>Apply</h5>
            <h5 onClick={() => navigate("/jobSeekerMessages")}>Messages</h5>
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
            <h2>Applications Reviewed</h2> 
            <h4>{applicationsReviewedCount}</h4>
          </div>
          <div className="admin-box">
            <h2>Pending Applications</h2>
            <h4>{pendingApplicationsCount}</h4>
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