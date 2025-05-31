import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./common.css";

export default function Admindash() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="main1">
      <div className={`${isCollapsed ? "collapsed" : "shown"}`}>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {!isCollapsed ? "☰" : "✖"}
        </button>
        {!isCollapsed && (
          <div className="menu-items">
            <h5 onClick={() => navigate("/dashboard")}>Dashboard</h5>
            <h5 onClick={() => navigate("/postNew")}>Post New Job</h5>
            <h5 onClick={() => navigate("/jobPosted")}>Jobs Posted</h5>
            <h5 onClick={() => navigate("/")}>Applicant Details</h5>
            <h5 onClick={() => navigate("/message")}>Messages</h5>
            <h5 onClick={() => navigate("/")}>Settings</h5>
          </div>
        )}
      </div>
      <div className="main-content1">
        <div className="boxes">
          <div className="box1">
            <h2>Total Job Applications</h2>
            <h4>120</h4>
          </div>
          <div className="box2">
            <h2>Active Users</h2>
            <h4>50</h4>
          </div>
          <div className="box3">
            <h2>Jobs Posted</h2>
            <h4>25</h4>
          </div>
          <div className="box4">
            <h2>Application</h2>
            <h4>Trends</h4>
          </div>
        </div>

        <div className="recent-applications">
          <h2>Recent Job Applications</h2>
          <table>
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
