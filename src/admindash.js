import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./common.css";

export default function Admindash() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          </div>
        )}
      </div>

      <div className="admin-content">
        <div className="admin-boxes">
          <div className="admin-box">
            <h2>Total Job Applications</h2>
            <h4>120</h4>
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
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Position</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Software Engineer</td>
                <td><span className="status pending">Pending</span></td>
                <td><a href="#">Approve</a></td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>Product Manager</td>
                <td><span className="status accepted">Accepted</span></td>
                <td><a href="#">Approve</a></td>
              </tr>
              <tr>
                <td>Michael Johnson</td>
                <td>Data Analyst</td>
                <td><span className="status accepted">Accepted</span></td>
                <td><a href="#">Approve</a></td>
              </tr>
              <tr>
                <td>Emily Davis</td>
                <td>Graphic Designer</td>
                <td><span className="status rejected">Rejected</span></td>
                <td><a href="#">Approve</a></td>
              </tr>
              <tr>
                <td>David Brown</td>
                <td>Sales Associate</td>
                <td><span className="status rejected">Rejected</span></td>
                <td><a href="#">Reject</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
