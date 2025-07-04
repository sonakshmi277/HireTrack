import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import "./job.css";

export default function JobPosted() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/job");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDownload = () => {
    const element = modalRef.current;
    html2pdf().from(element).save(`${selectedJob.title}_Details.pdf`);
  };

  return (
    <div className="job-posted-container">
      <div className="job-posted-header">
        <div>Job Title</div>
        <div>Company</div>
        <div>View Details</div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading jobs...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p style={{ textAlign: "center" }}>No jobs posted yet.</p>
      )}

      {jobs.map((job, index) => (
        <div className="job-posted-row" key={index}>
          <div>{job.title}</div>
          <div>{job.company}</div>
          <div>
            <button className="view-btn" onClick={() => setSelectedJob(job)}>
              View
            </button>
          </div>
        </div>
      ))}

      {selectedJob && (
        <div className="modalOverlay">
          <div className="modalContent" ref={modalRef}>
            <h2>Job Details</h2>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Salary:</strong> {selectedJob.salary}</p>
            <p><strong>Type:</strong> {selectedJob.type}</p>
            <p><strong>Deadline:</strong> {selectedJob.deadline}</p>
            <p><strong>Skills:</strong> {selectedJob.skills}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <div className="modalActions">
              <button onClick={handleDownload}>Download PDF</button>
              <button onClick={() => setSelectedJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
